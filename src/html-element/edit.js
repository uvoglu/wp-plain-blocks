import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor'
import { TextareaControl, TextControl, PanelBody } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import './editor.scss'
import { parseDataAttributes } from './data-attributes-parser'

/**
 * Render inspector controls for the HTML Element block.
 *
 * @param {Object} props Component props.
 * @param {string} props.tagName The HTML tag name.
 * @param {string} props.anchor The ID of the element.
 * @param {string} props.className The classes of the element.
 * @param {string} props.dataset The data attributes of the element.
 * @param {Function} props.onChangeTagName onChange function for the tagName TextControl.
 * @param {Function} props.onChangeAnchor onChange function for the ID TextControl.
 * @param {Function} props.onChangeClassName onChange function for the className TextControl.
 * @param {Function} props.onChangeDataset onChange function for the dataset TextControl.
 *
 * @return {JSX.Element} The control group.
 */
function EditControls( {
	tagName,
	anchor,
	className,
	dataset,
	onChangeTagName,
	onChangeAnchor,
	onChangeClassName,
	onChangeDataset,
} ) {
	return (
		<InspectorControls>
			<PanelBody
				title={ __( 'Settings', 'plain-blocks' ) }
				initialOpen={ true }
			>
				<TextControl
					label={ __( 'Tag', 'plain-blocks' ) }
					help={ __(
						'The tag name to use for this HTML element',
						'plain-blocks'
					) }
					value={ tagName }
					onChange={ onChangeTagName }
				/>
				<TextControl
					label={ __( 'ID', 'plain-blocks' ) }
					help={ __(
						'The ID to use for this HTML element',
						'plain-blocks'
					) }
					value={ anchor }
					onChange={ onChangeAnchor }
				/>
				<TextareaControl
					label={ __( 'Class', 'plain-blocks' ) }
					help={ __(
						'The classes to use for this HTML element',
						'plain-blocks'
					) }
					value={ className }
					onChange={ onChangeClassName }
				/>
				<TextareaControl
					label={ __( 'Data Attributes', 'plain-blocks' ) }
					help={ __(
						'The data-* attributes to use for this HTML element',
						'plain-blocks'
					) }
					value={ dataset }
					onChange={ onChangeDataset }
				/>
			</PanelBody>
		</InspectorControls>
	)
}

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes, isSelected } ) {
	const { tagName, anchor, className, dataset } = attributes
	const TagName = tagName || 'div'

	const dataAttributes = Object.fromEntries(
		Object.entries( parseDataAttributes( dataset ) ).map(
			( [ key, value ] ) => [ `data-${ key }`, value ?? '' ]
		)
	)

	const blockProps = useBlockProps( {
		id: anchor,
		className,
		...dataAttributes,
	} )
	const innerBlocksProps = useInnerBlocksProps( {
		...blockProps,
		renderAppender: isSelected && InnerBlocks.ButtonBlockAppender,
	} )

	return (
		<>
			<EditControls
				tagName={ tagName }
				anchor={ anchor }
				className={ className }
				dataset={ dataset }
				onChangeTagName={ ( value ) =>
					setAttributes( { tagName: value || null } )
				}
				onChangeAnchor={ ( value ) =>
					setAttributes( { anchor: value || null } )
				}
				onChangeClassName={ ( value ) =>
					setAttributes( { className: value || null } )
				}
				onChangeDataset={ ( value ) =>
					setAttributes( { dataset: value || null } )
				}
			/>
			<TagName { ...innerBlocksProps } />
		</>
	)
}
