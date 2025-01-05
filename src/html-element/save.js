import { InnerBlocks, useBlockProps } from '@wordpress/block-editor'

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const { tagName, anchor, className } = attributes
	const TagName = tagName || 'div'

	return (
		<TagName { ...useBlockProps.save( { id: anchor, className } ) }>
			<InnerBlocks.Content />
		</TagName>
	)
}
