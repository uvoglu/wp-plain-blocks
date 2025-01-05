import { registerBlockType } from '@wordpress/blocks'
import './style.scss'
import edit from './edit'
import save from './save'
import settings from './settings'
import metadata from './block.json'

registerBlockType( metadata.name, {
	...settings( { defaultBlockLabel: metadata.title } ),
	edit,
	save,
} )
