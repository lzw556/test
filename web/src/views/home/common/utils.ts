export function generateColProps({ xs, sm, md, lg, xl, xxl }: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number }) {
  const colCount = 24;
  return {
    xs: { span: xs ?? colCount },
    sm: { span: sm ?? colCount },
    md: { span: md ?? colCount },
    lg: { span: lg ?? colCount },
    xl: { span: xl ?? colCount },
    xxl: { span: xxl ?? colCount }
  };
}

function pickBasePath(pathname: string, search: string) {
  let path = pathname;
  if (search.indexOf('/')) {
    const queries = search.split('/');
    if (queries.length > 0) path += queries[0];
  }
  return path;
}

export function combineFinalUrl(pathname: string, search: string, subpath: string, id: number) {
  const basePath = pickBasePath(pathname, search);
  return `${basePath}${subpath}&id=${id}`;
}