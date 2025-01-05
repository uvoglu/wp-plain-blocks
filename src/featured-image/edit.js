import clsx from 'clsx'
import { isBlobURL } from '@wordpress/blob'
import { useEntityProp, store as coreStore } from '@wordpress/core-data'
import { useSelect, useDispatch } from '@wordpress/data'
import {
	Button,
	FocalPointPicker,
	Placeholder,
	SelectControl,
	Spinner,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components'
import {
	InspectorControls,
	BlockControls,
	MediaPlaceholder,
	MediaReplaceFlow,
	useBlockProps,
	useBlockEditingMode,
	store as blockEditorStore,
} from '@wordpress/block-editor'
import { useEffect, useRef, useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { upload } from '@wordpress/icons'
import { store as noticesStore } from '@wordpress/notices'
import './editor.scss'

const ALLOWED_MEDIA_TYPES = [ 'image' ]
const DEFAULT_MEDIA_SIZE_SLUG = 'full'
const DEFAULT_FOCAL_POINT = { x: 0.5, y: 0.5 }

function getMediaSourceUrlBySizeSlug( media, sizeSlug ) {
	return (
		media?.sizes?.[ sizeSlug ]?.url ||
		media?.media_details?.sizes?.[ sizeSlug ]?.source_url ||
		media?.url ||
		media?.source_url
	)
}

function mediaPosition( { x, y } = DEFAULT_FOCAL_POINT ) {
	return `${ Math.round( x * 100 ) }% ${ Math.round( y * 100 ) }%`
}

export default function Edit( {
	clientId,
	attributes,
	setAttributes,
	context: { postId, postType: postTypeSlug, queryId },
} ) {
	const isDescendentOfQueryLoop = Number.isFinite( queryId )
	const { focalPoint, sizeSlug } = attributes
	const [ temporaryURL, setTemporaryURL ] = useState()

	const [ featuredImage, setFeaturedImage ] = useEntityProp(
		'postType',
		postTypeSlug,
		'featured_media',
		postId
	)

	const { media } = useSelect(
		( select ) => {
			const { getMedia } = select( coreStore )
			return {
				media:
					featuredImage &&
					getMedia( featuredImage, {
						context: 'view',
					} ),
			}
		},
		[ featuredImage, postTypeSlug, postId ]
	)

	const mediaUrl = getMediaSourceUrlBySizeSlug( media, sizeSlug )
	const imageUrl = temporaryURL || mediaUrl
	const mediaStyle = {
		objectPosition: focalPoint ? mediaPosition( focalPoint ) : undefined,
	}

	const ref = useRef()
	const blockProps = useBlockProps( {
		className: clsx( {
			'is-transient': temporaryURL,
		} ),
	} )
	const blockEditingMode = useBlockEditingMode()

	const placeholder = ( content ) => {
		return (
			<Placeholder
				className="block-editor-media-placeholder"
				withIllustration
				style={ {
					height: '100%',
					width: '100%',
				} }
			>
				{ content }
			</Placeholder>
		)
	}

	const { getSettings } = useSelect( blockEditorStore )
	const imageSizes = getSettings()?.imageSizes

	const onSelectImage = ( value ) => {
		if ( value?.id ) {
			setFeaturedImage( value.id )

			// Try to use the previous selected image size if it's available
			// otherwise try the default image size or fallback to full size.
			if (
				sizeSlug &&
				( value?.sizes?.[ sizeSlug ] ||
					value?.media_details?.sizes?.[ sizeSlug ] )
			) {
				updateImage( sizeSlug )
			} else {
				updateImage( DEFAULT_MEDIA_SIZE_SLUG )
			}
		}

		if ( value?.url && isBlobURL( value.url ) ) {
			setTemporaryURL( value.url )
		}
	}

	// Reset temporary url when media is available.
	useEffect( () => {
		if ( mediaUrl && temporaryURL ) {
			setTemporaryURL()
		}
	}, [ mediaUrl, temporaryURL ] )

	const { createErrorNotice } = useDispatch( noticesStore )
	const onUploadError = ( message ) => {
		createErrorNotice( message, { type: 'snackbar' } )
		setTemporaryURL()
	}

	const updateImage = ( newSizeSlug ) => {
		const newUrl = getMediaSourceUrlBySizeSlug( media, newSizeSlug )
		if ( ! newUrl ) {
			return null
		}

		setAttributes( {
			url: newUrl,
			sizeSlug: newSizeSlug,
		} )
	}

	const imageSizeOptions = imageSizes
		?.filter(
			( { slug } ) => media?.media_details?.sizes?.[ slug ]?.source_url
		)
		?.map( ( { name, slug } ) => ( { value: slug, label: name } ) )

	const imperativeFocalPointPreview = ( value ) => {
		const [ styleOfRef, property ] = [ ref.current.style, 'objectPosition' ]
		styleOfRef[ property ] = mediaPosition( value )
	}

	const controls = blockEditingMode === 'default' && (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'plain-blocks' ) }
					resetAll={ () => {
						setAttributes( {
							focalPoint: undefined,
							sizeSlug: undefined,
						} )
					} }
				>
					{ !! imageSizeOptions?.length && (
						<ToolsPanelItem
							hasValue={ () =>
								sizeSlug !== DEFAULT_MEDIA_SIZE_SLUG
							}
							label={ __( 'Resolution', 'plain-blocks' ) }
							onDeselect={ () =>
								updateImage( DEFAULT_MEDIA_SIZE_SLUG )
							}
							isShownByDefault={ true }
							panelId={ clientId }
						>
							<SelectControl
								__nextHasNoMarginBottom
								label={ __( 'Resolution', 'plain-blocks' ) }
								value={ sizeSlug ?? DEFAULT_MEDIA_SIZE_SLUG }
								options={ imageSizeOptions }
								onChange={ updateImage }
								help={ __(
									'Select the size of the source image.',
									'plain-blocks'
								) }
								size="__unstable-large"
							/>
						</ToolsPanelItem>
					) }
					<ToolsPanelItem
						label={ __( 'Focal point', 'plain-blocks' ) }
						isShownByDefault
						hasValue={ () => !! focalPoint }
						onDeselect={ () =>
							setAttributes( {
								focalPoint: undefined,
							} )
						}
					>
						<FocalPointPicker
							__nextHasNoMarginBottom
							label={ __( 'Focal point', 'plain-blocks' ) }
							url={ mediaUrl }
							value={ focalPoint }
							onDragStart={ imperativeFocalPointPreview }
							onDrag={ imperativeFocalPointPreview }
							onChange={ ( newFocalPoint ) =>
								setAttributes( {
									focalPoint: newFocalPoint,
								} )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
		</>
	)

	/**
	 * A Post Featured Image block should not have image replacement
	 * or upload options in the following cases:
	 * - Is placed in a Query Loop. This is a conscious decision to
	 * prevent content editing of different posts in Query Loop, and
	 * this could change in the future.
	 * - Is in a context where it does not have a postId (for example
	 * in a template or template part).
	 */
	if ( ! featuredImage && ( isDescendentOfQueryLoop || ! postId ) ) {
		return (
			<>
				{ controls }
				<div { ...blockProps }>{ placeholder() }</div>
			</>
		)
	}

	let featuredImageView

	/**
	 * When the post featured image block is placed in a context where:
	 * - It has a postId (for example in a single post)
	 * - It is not inside a query loop
	 * - It has no image assigned yet
	 * Then display the placeholder with the image upload option.
	 */
	if ( ! featuredImage && ! temporaryURL ) {
		featuredImageView = (
			<MediaPlaceholder
				onSelect={ onSelectImage }
				accept="image/*"
				allowedTypes={ ALLOWED_MEDIA_TYPES }
				onError={ onUploadError }
				placeholder={ placeholder }
				mediaLibraryButton={ ( { open } ) => {
					return (
						<Button
							__next40pxDefaultSize
							icon={ upload }
							variant="primary"
							label={ __(
								'Add a featured image',
								'plain-blocks'
							) }
							showTooltip
							tooltipPosition="top center"
							onClick={ () => {
								open()
							} }
						/>
					)
				} }
			/>
		)
	} else {
		// We have a Featured image so show a Placeholder if is loading.
		featuredImageView = ! imageUrl ? (
			placeholder()
		) : (
			<>
				<img
					ref={ ref }
					alt={ media?.alt_text ? media.alt_text : undefined }
					className="wp-block-plain-blocks-featured-image__image-background"
					src={ imageUrl }
					style={ mediaStyle }
				/>
				{ temporaryURL && <Spinner /> }
			</>
		)
	}

	/**
	 * When the post featured image block:
	 * - Has an image assigned
	 * - Is not inside a query loop
	 * Then display the image and the image replacement option.
	 */
	return (
		<>
			{ ! temporaryURL && controls }
			{ !! media && ! isDescendentOfQueryLoop && (
				<BlockControls group="other">
					<MediaReplaceFlow
						mediaId={ featuredImage }
						mediaURL={ mediaUrl }
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						accept="image/*"
						onSelect={ onSelectImage }
						onError={ onUploadError }
						onReset={ () => setFeaturedImage( 0 ) }
					/>
				</BlockControls>
			) }
			<div { ...blockProps }>{ featuredImageView }</div>
		</>
	)
}
