/**
 * Compiles a url with the given query string and encodes it.
 * @param url {string}
 * @param query {{[p: string]: any}}
 * @return {string}
 */
export const compileUrl = (url:string, query?: {[p:string]: any}) => {
  const q = query && Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
  return encodeURI(q ? `${url}?${q}` : url);
};
