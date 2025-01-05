import { getBlobTypeByURL, isBlobURL } from '@wordpress/blob'

export const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ]
export const IMAGE_BACKGROUND_TYPE = 'image'
export const VIDEO_BACKGROUND_TYPE = 'video'
export const DEFAULT_MEDIA_SIZE_SLUG = 'full'
export const DEFAULT_FOCAL_POINT = { x: 0.5, y: 0.5 }

export function attributesFromMedia( media ) {
	if ( ! media || ( ! media.url && ! media.src ) ) {
		return {
			url: undefined,
			id: undefined,
		}
	}

	if ( isBlobURL( media.url ) ) {
		media.type = getBlobTypeByURL( media.url )
	}

	let mediaType
	// For media selections originated from a file upload.
	if ( media.media_type ) {
		if ( media.media_type === IMAGE_BACKGROUND_TYPE ) {
			mediaType = IMAGE_BACKGROUND_TYPE
		} else {
			// Only images and videos are accepted so if the media_type is not an image we can assume it is a video.
			// Videos contain the media type of 'file' in the object returned from the rest api.
			mediaType = VIDEO_BACKGROUND_TYPE
		}
		// For media selections originated from existing files in the media library.
	} else if (
		media.type &&
		( media.type === IMAGE_BACKGROUND_TYPE ||
			media.type === VIDEO_BACKGROUND_TYPE )
	) {
		mediaType = media.type
	} else {
		return
	}

	return {
		url: media.url || media.src,
		id: media.id,
		alt: media?.alt,
		backgroundType: mediaType,
	}
}

export function getMediaSourceUrlBySizeSlug( media, sizeSlug ) {
	return (
		media?.sizes?.[ sizeSlug ]?.url ||
		media?.media_details?.sizes?.[ sizeSlug ]?.source_url ||
		media?.url ||
		media?.source_url
	)
}

export function mediaPosition( { x, y } = DEFAULT_FOCAL_POINT ) {
	return `${ Math.round( x * 100 ) }% ${ Math.round( y * 100 ) }%`
}
