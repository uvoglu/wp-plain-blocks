<?php
/**
 * Plugin Name:       Plain Blocks
 * Description:       A collection of plain (unstyled) Gutenberg blocks, intended to use in connection with utility CSS classes.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            UVOGLU
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       plain-blocks
 *
 * @package PlainBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers a custom category for the blocks provided by this plugin.
 */
function plain_blocks_add_block_category( $block_categories, $editor_context ) {
	array_push(
		$block_categories,
		array(
			'slug'  => 'plain-blocks',
			'title' => __( 'Plain Blocks', 'plain-blocks' ),
			'icon'  => null,
		)
	);
	return $block_categories;
}
add_filter( 'block_categories_all', 'plain_blocks_add_block_category', 10, 2 );

/**
 * Registers the blocks using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function plain_blocks_register_block_types() {
	register_block_type( __DIR__ . '/build/html-element' );
	register_block_type( __DIR__ . '/build/featured-image' );
	register_block_type( __DIR__ . '/build/hero' );
}
add_action( 'init', 'plain_blocks_register_block_types' );
