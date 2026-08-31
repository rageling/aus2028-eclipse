/* Theme toggle, shared by both published sites.
   Cycles system -> light -> dark -> system. "System" is a real third state, not
   an absence: it means "keep following the OS", which is what most people want
   and what the page does before anyone touches the button.

   The no-flash snippet that applies the stored choice lives inline in each page's
   <head>, because it has to run before first paint. This file only handles the
   button. Every localStorage access is wrapped: it throws outright in some
   contexts (private windows, browsers set to block site data), and a page that
   cannot remember a preference should still render correctly. */
(function () {
  "use strict";

  var KEY = "theme";
  var STATES = [
    { value: null,    label: "Auto",  icon: "◑", hint: "Following your system setting. Click for light." },
    { value: "light", label: "Light", icon: "☀", hint: "Light. Click for dark." },
    { value: "dark",  label: "Dark",  icon: "☽", hint: "Dark. Click to follow your system setting." }
  ];

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { v === null ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, v); } catch (e) {}
  }
  function indexOfCurrent() {
    var v = read();
    for (var i = 0; i < STATES.length; i++) { if (STATES[i].value === v) return i; }
    return 0;
  }

  function apply(state, btn) {
    if (state.value) {
      document.documentElement.setAttribute("data-theme", state.value);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    if (btn) {
      btn.innerHTML = "";
      var icon = document.createElement("span");
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = state.icon;
      btn.appendChild(icon);
      btn.appendChild(document.createTextNode(state.label));
      btn.setAttribute("aria-label", "Colour theme: " + state.hint);
      btn.setAttribute("title", state.hint);
    }
  }

  function init() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    var i = indexOfCurrent();
    apply(STATES[i], btn);
    btn.addEventListener("click", function () {
      i = (i + 1) % STATES.length;
      write(STATES[i].value);
      apply(STATES[i], btn);
    });
  }

  document.documentElement.classList.remove("no-js");
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
