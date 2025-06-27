# Plain Blocks

A collection of plain (unstyled) Gutenberg blocks, intended to use in connection with utility CSS classes.

## Generate Translations

To generate translations, use the following commands with the [WP-CLI](https://make.wordpress.org/cli/handbook/installing/)

- `npm run build` (this is required to make sure that built files are avilable when generating the `.pot` file, so it can reference the built file, which is needed to load `.json` translations with md5 path suffix correctly)
- `wp i18n make-pot . languages/plain-blocks.pot`
- `cp languages/plain-blocks.pot languages/plain-blocks-de.po`
- Do the same for all other languages you want, e.g., `cp languages/plain-blocks.pot languages/plain-blocks-de_CH_informal.po`
- Edit the translations in `languages/plain-blocks-de.pot` (make sure that for JS files, the file from `./build` is included)
- `wp i18n make-mo languages`
- `wp i18n make-json plain-blocks-de.po --no-purge`

## Loading Translations

Starting with WordPress 6.8, translations can be loaded by using the `Text Domain` and `Domain Path` properties in `plain-blocks.php`'s header. With that, it's no longer needed to call `load_plugin_textdomain`.
