/* Renders data.json into the site using the site's own card classes.
   Containers: #projects-grid, #skills-grid, #interests-grid, #education-timeline, #research-experience-list.
   If data.json cannot load, the static HTML already in the page stays as a fallback. */
(function () {
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var spans = function (a) { return (a || []).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join(""); };
  var link = function (u, t) {
    if (!/^(https?:\/\/|#|mailto:)/i.test(String(u || "").trim())) return "";
    var ext = u.charAt(0) !== "#" ? ' target="_blank" rel="noopener noreferrer"' : "";
    return '<a class="text-link" href="' + esc(u) + '"' + ext + ">" + esc(t || "Link ↗") + "</a>";
  };
  function run() {
    fetch("data.json?v=" + Date.now())
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        var p = document.getElementById("projects-grid");
        if (p && d.projects && d.projects.length) p.innerHTML = d.projects.map(function (x) {
          return '<article class="card project-card reveal visible"><div class="project-top"><div class="project-symbol">' + esc(x.icon || "＋") +
            '</div><span class="project-status">' + esc(x.status) + "</span></div><h3>" + esc(x.title) + "</h3><p>" + esc(x.description) +
            '</p><div class="project-footer"><div class="stack">' + spans(x.tags) + "</div>" + link(x.link, x.linkText) + "</div></article>";
        }).join("");

        var s = document.getElementById("skills-grid");
        if (s && d.skills && d.skills.length) s.innerHTML = d.skills.map(function (g) {
          return '<article class="card skill-group reveal visible"><h3>' + esc(g.group) + '</h3><div class="skill-pills">' + spans(g.items) + "</div></article>";
        }).join("");

        var ri = document.getElementById("interests-grid");
        if (ri && d.interests && d.interests.length) ri.innerHTML = d.interests.map(function (x, i) {
          return '<article class="card research-card reveal visible"><div class="research-icon">' + esc(x.icon || "◎") + '</div><div><div class="number mono">AREA ' +
            (i < 9 ? "0" : "") + (i + 1) + "</div><h3>" + esc(x.title) + "</h3><p>" + esc(x.description) + "</p></div></article>";
        }).join("");

        var ed = document.getElementById("education-timeline");
        if (ed && d.education && d.education.length) ed.innerHTML = d.education.map(function (x) {
          return '<article class="card timeline-item reveal visible"><div class="meta">' + esc(String(x.label || "").toUpperCase()) + "</div><h3>" +
            esc(x.title) + "</h3><p>" + esc(x.description) + "</p></article>";
        }).join("");

        var r = document.getElementById("research-experience-list");
        if (r && d.research && d.research.length) r.innerHTML = d.research.map(function (x) {
          var who = [x.role, x.org].filter(Boolean).join(" · ");
          return '<article class="card research-card reveal visible"><div class="research-icon">' + esc(x.icon || "✦") + '</div><div><div class="number mono">' +
            esc(x.period) + "</div><h3>" + esc(x.title) + "</h3>" + (who ? '<p style="font-weight:600;margin-bottom:6px">' + esc(who) + "</p>" : "") +
            "<p>" + esc(x.description) + "</p>" + link(x.link, "View work ↗") + "</div></article>";
        }).join("");
      })
      .catch(function (e) { console.warn("portfolio.js: using built-in content", e); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
