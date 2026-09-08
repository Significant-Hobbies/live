/** Keep cached HTML tied to the assets emitted by its Next build. */
export function createReleaseCache(cache, buildId) {
  if (!buildId?.trim()) throw new Error('A build identity is required for the HTML cache.');
  function key(request) {
    const url = new URL(request.url);
    url.searchParams.set('__live_build', buildId);
    return new Request(url, { method: 'GET', headers: request.headers });
  }
  return {
    match: (request) => cache.match(key(request)),
    put: (request, response) => cache.put(key(request), response),
  };
}
