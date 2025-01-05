import icon from './icon'

export default function settings( { defaultBlockLabel } ) {
	return {
		icon,
		__experimentalLabel( { tagName, className } ) {
			return (
				[
					[ tagName ].filter( ( e ) => e ).join( '' ) +
						[ className ]
							.filter( ( e ) => e )
							.map( ( e ) => `.${ e }` )
							.join( '' ),
				]
					.map( ( e ) => ( e ? `&lt;${ e }&gt;` : '' ) )
					.join( '' ) || defaultBlockLabel
			)
		},
	}
}
