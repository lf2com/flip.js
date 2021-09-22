type Prefix = 'webkit' | 'o' | 'ms' | 'moz';

/**
 * Returns prefixed CSS text.
 */
function prefixCss(css: string, prefixs: Prefix | Prefix[]): string {
  const head = /^@/.test(css) ? '@-' : '-';
  const text = css
    .replace(/^@/, '')
    .replace(/;?$/, ';');

  return (Array.isArray(prefixs) ? prefixs : [prefixs])
    .map((prefix) => `${head}${prefix}-${text}`)
    .concat(css)
    .join('\n');
}

export default prefixCss;
