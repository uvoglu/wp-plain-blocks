import { registerBlockType } from '@wordpress/blocks'
import './style.scss'
import edit from './edit'
import icon from './icon'
import save from './save'
import metadata from './block.json'

registerBlockType( metadata.name, {
	icon,
	edit,
	save,
} )
