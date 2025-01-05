import clsx from 'clsx'
import { isBlobURL } from '@wordpress/blob'
import { store as coreStore } from '@wordpress/core-data'
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
import { useRef } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { upload } from '@wordpress/icons'
import { store as noticesStore } from '@wordpress/notices'
import './editor.scss'
import {
	ALLOWED_MEDIA_TYPES,
	attributesFromMedia,
	DEFAULT_MEDIA_SIZE_SLUG,
	getMediaSourceUrlBySizeSlug,
	IMAGE_BACKGROUND_TYPE,
	mediaPosition,
	VIDEO_BACKGROUND_TYPE,
} from './shared'

export default function Edit( { clientId, attributes, setAttributes } ) {
	const {
		alt,
		id,
		backgroundType,
		focalPoint,
		sizeSlug,
		url: originalUrl,
	} = attributes
	// Ensure the url is not malformed due to sanitization through `wp_kses`.
	const url = originalUrl?.replaceAll( '&amp;', '&' )

	const onSelectMedia = async ( newMedia ) => {
		const mediaAttributes = attributesFromMedia( newMedia )

		if (
			mediaAttributes.backgroundType === IMAGE_BACKGROUND_TYPE &&
			mediaAttributes?.id
		) {
			// Try to use the previous selected image size if it's available
			// otherwise try the default image size or fallback to full size.
			if (
				sizeSlug &&
				( newMedia?.sizes?.[ sizeSlug ] ||
					newMedia?.media_details?.sizes?.[ sizeSlug ] )
			) {
				mediaAttributes.sizeSlug = sizeSlug
				mediaAttributes.url = getMediaSourceUrlBySizeSlug(
					newMedia,
					sizeSlug
				)
			} else {
				mediaAttributes.sizeSlug = DEFAULT_MEDIA_SIZE_SLUG
				mediaAttributes.url = getMediaSourceUrlBySizeSlug(
					newMedia,
					DEFAULT_MEDIA_SIZE_SLUG
				)
			}
		}

		setAttributes( {
			...mediaAttributes,
			focalPoint: undefined,
		} )
	}

	const onClearMedia = () => {
		setAttributes( {
			url: undefined,
			id: undefined,
			backgroundType: undefined,
			focalPoint: undefined,
		} )
	}

	const { createErrorNotice } = useDispatch( noticesStore )
	const onUploadError = ( message ) => {
		createErrorNotice( message, { type: 'snackbar' } )
		setTemporaryURL()
	}

	const isUploadingMedia = ! id && isBlobURL( url )

	const isImageBackground = IMAGE_BACKGROUND_TYPE === backgroundType
	const isVideoBackground = VIDEO_BACKGROUND_TYPE === backgroundType

	const mediaStyle = {
		objectPosition: focalPoint ? mediaPosition( focalPoint ) : undefined,
	}

	const image = useSelect(
		( select ) =>
			id && isImageBackground
				? select( coreStore ).getMedia( id, { context: 'view' } )
				: null,
		[ id, isImageBackground ]
	)

	const updateImage = ( newSizeSlug ) => {
		const newUrl = image?.media_details?.sizes?.[ newSizeSlug ]?.source_url
		if ( ! newUrl ) {
			return null
		}

		setAttributes( {
			url: newUrl,
			sizeSlug: newSizeSlug,
		} )
	}

	const { getSettings } = useSelect( blockEditorStore )
	const imageSizes = getSettings()?.imageSizes

	const imageSizeOptions = imageSizes
		?.filter(
			( { slug } ) => image?.media_details?.sizes?.[ slug ]?.source_url
		)
		?.map( ( { name, slug } ) => ( { value: slug, label: name } ) )

	const imperativeFocalPointPreview = ( value ) => {
		const [ styleOfRef, property ] = [ ref.current.style, 'objectPosition' ]
		styleOfRef[ property ] = mediaPosition( value )
	}

	const ref = useRef()
	const blockProps = useBlockProps( {
		className: clsx( {
			'is-transient': isUploadingMedia,
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
							url={ url }
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

	let heroView

	if ( ! url ) {
		heroView = (
			<MediaPlaceholder
				onSelect={ onSelectMedia }
				accept="image/*,video/*"
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
								'Add an image or video',
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
		heroView =
			! url && ! isUploadingMedia ? (
				placeholder()
			) : (
				<>
					{ url && isImageBackground && (
						<img
							ref={ ref }
							alt={ alt ? alt : undefined }
							className="wp-block-plain-blocks-hero__image-background"
							src={ url }
							style={ mediaStyle }
						/>
					) }
					{ url && isVideoBackground && (
						<video
							ref={ ref }
							className="wp-block-plain-blocks-hero__video-background"
							autoPlay
							muted
							loop
							src={ url }
							style={ mediaStyle }
						/>
					) }
					{ isUploadingMedia && <Spinner /> }
				</>
			)
	}

	return (
		<>
			{ ! isUploadingMedia && controls }
			{ !! url && (
				<BlockControls group="other">
					<MediaReplaceFlow
						mediaId={ id }
						mediaURL={ url }
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						accept="image/*,video/*"
						name={
							! url
								? __( 'Add media', 'plain-blocks' )
								: __( 'Replace', 'plain-blocks' )
						}
						onSelect={ onSelectMedia }
						onError={ onUploadError }
						onReset={ onClearMedia }
					/>
				</BlockControls>
			) }
			<div { ...blockProps }>{ heroView }</div>
		</>
	)
}
