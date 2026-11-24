const routes = new Set(['/bucket-list', '/journal']);
const flightHeaders = [
  'rsc',
  'next-router-state-tree',
  'next-router-prefetch',
  'next-router-segment-prefetch',
  'next-action',
  'purpose',
  'sec-purpose',
  'range',
  'if-match',
  'if-none-match',
  'if-modified-since',
  'if-unmodified-since',
];
const stylesheet = /^\/_next\/static\/css\/[a-f0-9]{8,64}\.css$/i;
const criticalId = 'live-private-loading-style';

// The selectors match the existing two skeletons. Apply temporary styles only
// while a deferred stylesheet is loading, so the original layout takes over
// as soon as its full CSS arrives.
const pending = 'html:has(head link[data-live-style-pending])';
const list = `${pending} [aria-label="Loading My list"]`;
const journal = `${pending} [aria-label="Loading Journal"]`;
const criticalCss = `
${pending} {color-scheme:dark;background:#120e09}
${pending} body {visibility:hidden;margin:0}
${pending} #main:not(:has([aria-label="Loading My list"],[aria-label="Loading Journal"]))::before {
  visibility:visible;position:absolute;top:88px;left:16px;
  content:"Loading page…";color:#f7f3e9;font:16px/1.5 system-ui,sans-serif
}
${list},${journal} {
  visibility:visible;position:absolute;top:88px;left:50%;transform:translateX(-50%);
  width:min(calc(100% - 32px),712px);box-sizing:border-box
}
${list} {width:min(calc(100% - 32px),1132px)}
${list} .animate-pulse,${journal} .animate-pulse {background:#2a221b;border-radius:8px}
${journal}>div:nth-child(1) {width:min(256px,100%);height:44px}
${journal}>div:nth-child(2) {width:75%;height:40px;margin-top:16px}
${journal}>div:nth-child(3) {height:220px;margin-top:24px}
${journal}>div:nth-child(4) {width:144px;height:44px;margin-top:20px}
${list}[aria-busy="true"]>div:nth-child(1) {width:160px;height:40px}
${list}[aria-busy="true"]>div:nth-child(2) {width:192px;height:16px;margin-top:12px}
${list}[aria-busy="true"]>div:nth-child(3) {max-width:672px;height:48px;margin-top:28px}
${list} [aria-hidden="true"] {max-width:672px;margin-top:28px}
${list} [aria-hidden="true"]>div {display:flex;gap:16px;padding:20px 0;border-top:1px solid #2a221b}
${list} [aria-hidden="true"]>div>div:first-child {width:24px;height:24px;border-radius:50%}
${list} [aria-hidden="true"]>div>div:nth-child(2) {flex:1}
${list} [aria-hidden="true"]>div>div:nth-child(2)>div:first-child {width:75%;height:20px}
${list} [aria-hidden="true"]>div>div:nth-child(2)>div:nth-child(2) {width:50%;height:12px;margin-top:12px}
@media(min-width:640px) {
  ${journal} {top:108px;width:min(calc(100% - 48px),712px)}
  ${list} {top:104px;width:min(calc(100% - 48px),1132px)}
}
#live-style-reload {
  visibility:visible;position:fixed;z-index:100;inset:auto 16px 16px;
  max-width:420px;padding:16px;border:1px solid #857658;border-radius:12px;
  background:#1e1812;color:#f7f3e9;font:16px/1.5 system-ui,sans-serif
}
#live-style-reload button {
  min-height:44px;margin-top:8px;padding:4px 12px;
  border:0;border-radius:8px;background:#e7bf57;color:#1d1409;font:inherit
}
`;

const bootstrap = `(() => {
  document.getElementById('${criticalId}').media = 'all';
  function showRetry() {
    if (document.getElementById('live-style-reload')) return;
    const notice = document.createElement('div');
    notice.id = 'live-style-reload';
    notice.setAttribute('role', 'alert');
    const message = document.createElement('div');
    message.textContent = 'Page styles could not load.';
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Reload page';
    retry.addEventListener('click', () => location.reload());
    notice.append(message, retry);
    document.body.append(notice);
  }
  function finish(event) {
    const node = event.target;
    if (!node?.hasAttribute?.('data-live-style-pending')) return;
    node.removeAttribute('data-live-style-pending');
    if (event.type === 'load') node.removeAttribute('media');
    else if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showRetry, { once: true });
    } else showRetry();
  }
  document.addEventListener('load', finish, true);
  document.addEventListener('error', finish, true);
})();`;

const criticalHead = `<style id="${criticalId}" media="not all">${criticalCss}</style><script>${bootstrap}</script>`;

export function privateLoadingDocumentEligible(request, response, pathname) {
  return (
    routes.has(pathname) &&
    request.method === 'GET' &&
    (request.headers.get('accept') ?? '').includes('text/html') &&
    !flightHeaders.some((header) => request.headers.has(header)) &&
    !new URL(request.url).searchParams.has('_rsc') &&
    response.status === 200 &&
    response.body !== null &&
    (response.headers.get('content-type') ?? '').includes('text/html') &&
    !response.headers.has('content-security-policy') &&
    !response.headers.has('content-security-policy-report-only') &&
    !response.headers.has('content-encoding')
  );
}

let rewriter;

export function withPrivateLoadingDocument(request, response, pathname) {
  if (!globalThis.HTMLRewriter || !privateLoadingDocumentEligible(request, response, pathname)) {
    return response;
  }

  rewriter ??= new globalThis.HTMLRewriter()
    .on('head', {
      element(head) {
        head.prepend(criticalHead, { html: true });
      },
    })
    .on('head link[rel="stylesheet"][data-precedence="next"]', {
      element(link) {
        const href = link.getAttribute('href');
        if (!stylesheet.test(href ?? '')) return;
        // A fallback copy is only equivalent for these compiler-owned links.
        for (const [name] of link.attributes) {
          if (name !== 'href' && name !== 'rel' && name !== 'data-precedence') return;
        }
        link.before(`<link rel="preload" as="style" fetchpriority="high" href="${href}">`, {
          html: true,
        });
        link.setAttribute('media', 'print');
        link.setAttribute('data-live-style-pending', '');
        link.after(`<noscript><link rel="stylesheet" href="${href}"></noscript>`, { html: true });
      },
    });

  const transformed = new Response(response.body, response);
  for (const header of ['Content-Length', 'ETag', 'Content-MD5', 'Digest', 'Content-Digest']) {
    transformed.headers.delete(header);
  }
  return rewriter.transform(transformed);
}
