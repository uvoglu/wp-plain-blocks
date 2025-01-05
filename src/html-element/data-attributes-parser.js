/**
 * Parse data attributes from a string in the format as found on a HTML element.
 *
 * @param {string} input The string to parse from.
 *
 * @return {Object} The object containing the dataset elements.
 */
export function parseDataAttributes( input ) {
	const datasetString = input?.toLowerCase() ?? ''

	const result = {}
	const dataAttributePattern = /data-([\w-]+)(?:\s*=\s*(["'])([^\2]*?)\2)?/g

	let match
	while ( ( match = dataAttributePattern.exec( datasetString ) ) !== null ) {
		const key = match[ 1 ]
		const value = match[ 3 ] !== undefined ? match[ 3 ] : null
		result[ key ] = value
	}

	return result
}
