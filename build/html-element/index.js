(()=>{"use strict";var e,n={347:()=>{const e=window.wp.blocks,n=window.wp.blockEditor,l=window.wp.components,a=window.wp.i18n,o=window.ReactJSXRuntime;function s({tagName:e,anchor:s,className:t,onChangeTagName:r,onChangeAnchor:i,onChangeClassName:c}){return(0,o.jsx)(n.InspectorControls,{children:(0,o.jsxs)(l.PanelBody,{title:(0,a.__)("Settings","plain-blocks"),initialOpen:!0,children:[(0,o.jsx)(l.TextControl,{label:(0,a.__)("Tag","plain-blocks"),help:(0,a.__)("The tag name to use for this HTML element","plain-blocks"),value:e,onChange:r}),(0,o.jsx)(l.TextControl,{label:(0,a.__)("ID","plain-blocks"),help:(0,a.__)("The ID to use for this HTML element","plain-blocks"),value:s,onChange:i}),(0,o.jsx)(l.TextareaControl,{label:(0,a.__)("Class","plain-blocks"),help:(0,a.__)("The classes to use for this HTML element","plain-blocks"),value:t,onChange:c})]})})}const t=window.wp.primitives,r=(0,o.jsx)(t.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:(0,o.jsx)(t.Path,{fillRule:"evenodd",clipRule:"evenodd",d:"M4.25 7A2.75 2.75 0 0 1 7 4.25h10A2.75 2.75 0 0 1 19.75 7v10A2.75 2.75 0 0 1 17 19.75H7A2.75 2.75 0 0 1 4.25 17V7ZM7 5.75c-.69 0-1.25.56-1.25 1.25v10c0 .69.56 1.25 1.25 1.25h10c.69 0 1.25-.56 1.25-1.25V7c0-.69-.56-1.25-1.25-1.25H7Z"})}),i=JSON.parse('{"UU":"plain-blocks/html-element","DD":"HTML Element"}');(0,e.registerBlockType)(i.UU,{...function({defaultBlockLabel:e}){return{icon:r,__experimentalLabel:({tagName:n,className:l})=>[[n].filter((e=>e)).join("")+[l].filter((e=>e)).map((e=>`.${e}`)).join("")].map((e=>e?`&lt;${e}&gt;`:"")).join("")||e}}({defaultBlockLabel:i.DD}),edit:function({attributes:e,setAttributes:l,isSelected:a}){const{tagName:t,anchor:r,className:i}=e,c=t||"div",p=(0,n.useBlockProps)({id:r,className:i}),h=(0,n.useInnerBlocksProps)({...p,renderAppender:a&&n.InnerBlocks.ButtonBlockAppender});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(s,{tagName:t,anchor:r,className:i,onChangeTagName:e=>l({tagName:e||null}),onChangeAnchor:e=>l({anchor:e||null}),onChangeClassName:e=>l({className:e||null})}),(0,o.jsx)(c,{...h})]})},save:function({attributes:e}){const{tagName:l,anchor:a,className:s}=e,t=l||"div";return(0,o.jsx)(t,{...n.useBlockProps.save({id:a,className:s}),children:(0,o.jsx)(n.InnerBlocks.Content,{})})}})}},l={};function a(e){var o=l[e];if(void 0!==o)return o.exports;var s=l[e]={exports:{}};return n[e](s,s.exports,a),s.exports}a.m=n,e=[],a.O=(n,l,o,s)=>{if(!l){var t=1/0;for(p=0;p<e.length;p++){for(var[l,o,s]=e[p],r=!0,i=0;i<l.length;i++)(!1&s||t>=s)&&Object.keys(a.O).every((e=>a.O[e](l[i])))?l.splice(i--,1):(r=!1,s<t&&(t=s));if(r){e.splice(p--,1);var c=o();void 0!==c&&(n=c)}}return n}s=s||0;for(var p=e.length;p>0&&e[p-1][2]>s;p--)e[p]=e[p-1];e[p]=[l,o,s]},a.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),(()=>{var e={98:0,614:0};a.O.j=n=>0===e[n];var n=(n,l)=>{var o,s,[t,r,i]=l,c=0;if(t.some((n=>0!==e[n]))){for(o in r)a.o(r,o)&&(a.m[o]=r[o]);if(i)var p=i(a)}for(n&&n(l);c<t.length;c++)s=t[c],a.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return a.O(p)},l=globalThis.webpackChunkplain_blocks=globalThis.webpackChunkplain_blocks||[];l.forEach(n.bind(null,0)),l.push=n.bind(null,l.push.bind(l))})();var o=a.O(void 0,[614],(()=>a(347)));o=a.O(o)})();