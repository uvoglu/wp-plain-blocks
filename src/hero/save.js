import clsx from 'clsx'
import { useBlockProps } from '@wordpress/block-editor'

import {
	IMAGE_BACKGROUND_TYPE,
	VIDEO_BACKGROUND_TYPE,
	mediaPosition,
} from './shared'

export default function save( { attributes } ) {
	const { backgroundType, focalPoint, url, alt, id, sizeSlug } = attributes

	const isImageBackground = IMAGE_BACKGROUND_TYPE === backgroundType
	const isVideoBackground = VIDEO_BACKGROUND_TYPE === backgroundType

	const objectPosition = focalPoint ? mediaPosition( focalPoint ) : undefined

	const imgClasses = clsx(
		'wp-block-plain-blocks-hero__image-background',
		id ? `wp-image-${ id }` : null,
		{
			[ `size-${ sizeSlug }` ]: sizeSlug,
		}
	)

	return (
		<div { ...useBlockProps.save() }>
			{ url && isImageBackground && (
				<img
					className={ imgClasses }
					alt={ alt ? alt : undefined }
					src={ url }
					style={ { objectPosition } }
					data-object-fit="cover"
					data-object-position={ objectPosition }
				/>
			) }
			{ url && isVideoBackground && (
				<video
					className="wp-block-plain-blocks-hero__video-background"
					autoPlay
					muted
					loop
					playsInline
					src={ url }
					style={ { objectPosition } }
					data-object-fit="cover"
					data-object-position={ objectPosition }
				/>
			) }
		</div>
	)
}
