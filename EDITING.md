# Editing jlsola.com

This site is a small, hand-rolled Jekyll build hosted on GitHub Pages. No framework, no build step beyond GitHub's own — open a file in a text editor, commit, push. Wait ~60s for Pages to rebuild.

## File layout

```
/
├── _config.yml                  site-wide config (title, url, plugins)
├── _layouts/
│   └── default.html             shared chrome: head, top nav, main, footer
├── _includes/
│   └── google-analytics.html    GA4 tag (G-CMW3H6D7HX)
├── assets/
│   └── css/site.css             all styles; single source of truth
├── index.html                   Research / publications list
├── about.html                   About me
├── gun_desirability.html        Methods page (Qualtrics recipe)
├── 404.html                     Fallback
├── favicon.svg / .ico           Icons (SVG is primary; .ico is legacy fallback)
├── favicon-32.png               32px raster icon
├── favicon-180.png              apple-touch-icon
├── CNAME                        www.jlsola.com (do not change without DNS coordination)
└── files/                       CV, headshot, survey prompt images, etc.
    ├── Sola_CV.pdf
    ├── edited_headshot_w1064.jpg
    ├── pistol.png / ar-15.png / hunting_rifle.png
    └── hunting_rifle_example.png
```

## How pages fit together

Each `.html` page at the repo root has a YAML front-matter block:

```yaml
---
layout: default
permalink: /about.html
title: "About — Justin Lucas Sola, PhD"
description: "…"
nav: about               # which top-nav item to highlight (research | about | gun_desirability)
footer_note: '<a href="mailto:jlsola@unc.edu">jlsola@unc.edu</a>'
---
```

Everything under the front matter is the body content; the layout (`_layouts/default.html`) wraps it with `<!doctype>`, `<head>`, the top bar, and the footer.

## Swap recipes

### Add a publication
Open `index.html`. Find `<ol class="pubs">`. Copy the most recent `<li>` and edit in place.

```html
<li>  <!-- add class="invited" for commentaries -->
  <div class="year">2026</div>
  <div class="pub-venue">
    <span class="venue-name">Law &amp; Society Review</span>
    Online First
  </div>
  <div>
    <div class="pub-title">
      <a class="ext" href="https://doi.org/...">"Title."</a>
    </div>
    <div class="pub-authors">
      <strong>Justin L. Sola</strong>
    </div>
    <!-- optional award pill -->
    <span class="award">2024 Best Paper Award</span>
  </div>
</li>
```

- **Year** in `.year` — pubs are grouped visually by this column.
- **Venue** italicized name + note underneath (issue, pages, "Online First", etc.).
- **Authors**: wrap your name in `<strong>`. Multi-author: `First A., Second B., and Third C.` — Oxford comma.
- **External / DOI links**: always `class="ext"` — gives them the purple hover (the one place purple appears in body text).
- **Invited / commentary**: add `class="invited"` to the `<li>`. The row is subdued and an "Invited" pill appears.
- **Award**: add a `<span class="award">` — outlined gold star pill.

### Add a fellowship or award (About)
Edit `about.html` → `<ul class="fellowship-list">`. One `<li>` per item. `class="flagship"` highlights one in purple.

### Add a page to the top navigation
Top nav lives once in `_layouts/default.html` — not per page. To add a link:

1. In `_layouts/default.html`, copy one of the `<a>` tags inside `<nav class="primary">`. Set its `href` and the `{% if page.nav == '…' %}class="current"{% endif %}` condition.
2. Create a new `.html` page at the repo root with `layout: default` and `nav: your-new-name` in front matter.

### Rename / add a redirect
Use the `jekyll-redirect-from` plugin. In the page's front matter:

```yaml
redirect_from:
  - /old_slug
  - /old_slug.html
  - /old_slug/
```

That generates tiny HTML pages at each old URL that meta-refresh to the new one. `about.html` already has this wired for the legacy `/about_me*` URLs.

### Change a color
All colors live in `assets/css/site.css` under `:root`:

| Token        | Value     | Where it appears                                       |
|--------------|-----------|--------------------------------------------------------|
| `--navy`     | `#1B3D6D` | Top bar, headings, year column, link color, rules      |
| `--gold`     | `#EE9900` | Hover underline, current-nav, award pill, code rail    |
| `--purple`   | `#5A007E` | External-link hover, focus ring, flagship pill         |
| `--muted`    | `#5f6b7c` | Secondary text, captions, venue lines                  |
| `--ink`      | `#1c1c1c` | Body text                                              |

Edit the hex, save, push.

### Change the sigil (gold dot by the name)
`.topline .mark::before` in `site.css` — it's a 7px circle. Change `background` to retint, `width`/`height` to resize. The dot in the footer is `.foot .sigil` (8px).

### Replace the favicon
Edit `favicon.svg` directly — plain XML. Then export 32×32 and 180×180 PNGs (any tool) and overwrite `favicon-32.png` / `favicon-180.png`. The legacy `favicon.ico` is only a fallback for ancient browsers; leave it alone unless you feel like regenerating.

### Google Analytics
Change the tag ID in `_includes/google-analytics.html` if you ever rotate properties. It's included once by the layout, so all pages pick it up automatically.

## Local preview

```bash
gem install jekyll jekyll-seo-tag jekyll-redirect-from jekyll-sitemap
jekyll serve
# → http://127.0.0.1:4000
```

GitHub Pages uses its own pinned versions of these plugins, so minor output differences are possible; the live build is authoritative.

## Publishing

Commit to the default branch (`master`) and push. GitHub Pages rebuilds automatically within ~60s. You can watch the status under **Actions** on GitHub.

The `CNAME` file (currently `www.jlsola.com`) tells Pages which custom domain to serve. DNS is managed through Cloudflare; any domain change needs to be coordinated there too.
