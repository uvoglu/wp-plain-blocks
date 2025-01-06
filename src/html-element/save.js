import { InnerBlocks, useBlockProps } from '@wordpress/block-editor'
import { parseDataAttributes } from './data-attributes-parser'

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const { tagName, anchor, className, dataset } = attributes
	const TagName = tagName || 'div'

	const dataAttributes = Object.fromEntries(
		Object.entries( parseDataAttributes( dataset ) ).map(
			( [ key, value ] ) => [ `data-${ key }`, value ?? '' ]
		)
	)

	return (
		<TagName
			{ ...useBlockProps.save( {
				id: anchor,
				className,
				...dataAttributes,
			} ) }
		>
			<InnerBlocks.Content />
		</TagName>
	)
}
