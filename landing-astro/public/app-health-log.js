// App Health browser logs. Public, origin-pinned key; nothing here is secret.
// Logs form submits, clicks on [data-log] elements, and client errors to the
// Logs tab at health.sassmaker.com. window.appHealthLog(event, options) is
// available for custom events. Source: app-health/examples/dropin-log-client.
(function () {
  var KEY = "ahk_pub_3e6b82f4742971c7736b2a6131918d0839e6fb2cd90f0c29", ENV = "production", URL = "https://ingest.sassmaker.com/v1/logs";
  function id() { return crypto.randomUUID(); }
  function send(event, o) {
    o = o || {};
    var props = {}, src = o.props || {};
    for (var k in src) if (src[k] !== undefined) props[k] = typeof src[k] === "string" ? src[k].slice(0, 500) : src[k];
    var body = JSON.stringify({ public_key: KEY, batch_id: id(), schema_version: "v1", environment: ENV,
      logs: [{ log_id: id(), timestamp: Date.now(), event: event, level: o.level || "info", title: o.title, description: o.description, icon: o.icon, props: props }] });
    if (document.visibilityState === "hidden" && navigator.sendBeacon) { navigator.sendBeacon(URL, new Blob([body], { type: "text/plain" })); return; }
    fetch(URL, { method: "POST", headers: { "content-type": "text/plain" }, body: body, keepalive: true }).catch(function () {});
  }
  window.appHealthLog = send;
  document.addEventListener("submit", function (e) {
    var f = e.target; if (!f || f.tagName !== "FORM") return;
    send("form.submitted", { title: f.id || f.getAttribute("name") || f.getAttribute("action") || "form", props: { page: location.pathname } });
  }, true);
  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target.closest("[data-log]") : null;
    var name = t && t.getAttribute("data-log");
    if (name) {
      send(name, { title: (t.textContent || "").trim().slice(0, 120) || name, props: { page: location.pathname } });
      try {
        var tracker = window.appHealth;
        if (tracker && typeof tracker.track === "function") {
          tracker.track(name);
          if (isPlainSameTabLink(e, t) && typeof tracker.flush === "function") {
            e.preventDefault();
            var navigated = false;
            var timer = setTimeout(navigate, 4000);
            function navigate() {
              if (navigated) return;
              navigated = true;
              clearTimeout(timer);
              location.assign(t.href);
            }
            try { Promise.resolve(tracker.flush()).then(navigate, navigate); }
            catch (_) { navigate(); }
          }
        }
      } catch (_) {}
    }
  }, true);
  function isPlainSameTabLink(e, t) {
    return e.button === 0 && !e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey &&
      t.tagName === "A" && !t.hasAttribute("download") && (!t.target || t.target === "_self") &&
      t.origin === location.origin && t.href !== location.href;
  }
  window.addEventListener("error", function (e) {
    send("client.error", { level: "error", title: String(e.message || "error").slice(0, 200), props: { page: location.pathname } });
  });
  window.addEventListener("unhandledrejection", function (e) {
    var r = e.reason && e.reason.message ? e.reason.message : String(e.reason);
    send("client.error", { level: "error", title: r.slice(0, 200), props: { page: location.pathname, kind: "rejection" } });
  });
})();
