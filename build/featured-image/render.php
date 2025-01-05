<?php
$object_position = isset( $attributes['focalPoint'] )
	? round( $attributes['focalPoint']['x'] * 100 ) . '% ' . round( $attributes['focalPoint']['y'] * 100 ) . '%'
	: null;

$attr = array(
	'class' => 'wp-block-plain-blocks-featured-image__image-background',
	'data-object-fit' => 'cover',
);

if ( $object_position ) {
	$attr['data-object-position'] = $object_position;
	$attr['style'] = 'object-position:' . $object_position . ';';
}

$image = get_the_post_thumbnail( null, $attributes['sizeSlug'] ?? 'full', $attr );
if ( ! $image ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes();
echo "<div {$wrapper_attributes}>{$image}</div>";
