# Editing jlsola.com

The website is plain HTML and one CSS file, with a small shared Jekyll layout. GitHub Pages builds it automatically. You do not need to run any software to update it on GitHub.

## Replace the CV or headshot

- **CV:** replace `files/Sola_CV.pdf` with your new PDF using that exact filename. All CV links continue to work.
- **Headshot:** replace `files/edited_headshot_w1064.jpg` with a new JPG using that exact filename. The image keeps its original proportions and scales to fit; there is no fixed crop. If your new image is a PNG, export it as a JPG first or change the filename in `about.html`.

Replacing the file directly is simplest. Deleting and uploading the same-named file also works; the link will briefly be unavailable between the two commits. If a browser shows the old file afterward, refresh with Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac).

## Where to edit

| File | What it controls |
| --- | --- |
| `index.html` | Email and ORCID links, research statement, teaching interests, publications |
| `about.html` | Biography, fellowships, projects, service, headshot |
| `gun_desirability.html` | Qualtrics instructions and download links |
| `_layouts/default.html` | Navigation, copyright note, shared page structure |
| `assets/css/site.css` | Typography, colors, spacing, mobile layout |
| `assets/fonts/` | Local font files and their license |
| `_config.yml` | Site metadata and Jekyll settings |
| `files/` | CV, headshot, and research materials |

Keep the YAML block between `---` lines at the top of each page. The HTML below it is the page content.

## Add a publication

In `index.html`, find `<ol class="pubs">`. Copy one complete `<li>...</li>` block, put it in date order, and replace the text and DOI:

```html
<li>
  <div class="year">2026</div>
  <div class="pub-detail">
    <div class="pub-title">
      <a href="https://doi.org/your-doi">Article title</a>
    </div>
    <div class="pub-authors"><strong>Justin L. Sola</strong> and Coauthor</div>
    <div class="pub-venue">
      <span class="venue-name">Journal Name</span>Volume(issue): pages
    </div>
  </div>
</li>
```

Use `&amp;` for `&` in HTML. Your name can remain bold. Add an optional plain award note with `<span class="award">Award text</span>`. Keep the public DOI link rather than a university-library proxy URL.

For invited work, use `<li class="invited">` and add `<span class="invited-tag">Invited</span>` immediately before the title link, inside `pub-title`. The badge is separate from the title. The stylesheet automatically mutes that entry slightly. Leave the article's actual title unchanged and put “Book review” or “Focus article” with the journal details.

## Edit fellowships and projects

In `about.html`, each fellowship or project is one `<li>` inside its respective list. Fellowships have a date, name, and optional institution:

```html
<li>
  <span class="fellowship-year">2026&ndash;27</span>
  <span>
    <span class="fellowship-name">Fellowship name</span>
    <span class="fellowship-org">Institution</span>
  </span>
</li>
```

You can omit the institution span. The alternating row color and mobile layout are automatic; do not add row-specific styles. Projects remain simple list items.

The original navy is `--navy: #1b3d6d` in `assets/css/site.css`. It controls the header, headings, and methods step markers. `--navy-tint` controls the pale backgrounds.

The original gold is `--gold: #ee9900`. It appears on hovered links and the active navigation link. `--gold-hover` uses the original half-opacity gold for a subtler underline when hovering over another navigation link. These effects also work with keyboard focus.

Source Serif 4 is used throughout the site, including navigation and captions. Its regular and italic font files are stored locally in `assets/fonts/`, so the downloaded preview uses the same type offline. The files retain common accents and punctuation, and the shared layout preloads them to reduce a brief fallback-font flash. The `--serif` variable and the two `@font-face` rules at the top of `assets/css/site.css` control the font. Keep the accompanying license with the font files.

On the methods page, the three section headings have stable `id` values. Keep these IDs when editing their text so the in-page links keep working. The code is visible and selectable; no JavaScript interface is needed.

## Shared navigation and redirects

Edit navigation once in `_layouts/default.html`. For a new page, copy an existing page and update `title`, `description`, `nav`, and `permalink` in its YAML block. The current About page retains redirects from `/about_me`, `/about_me.html`, and `/about_me/`.

The only element at the bottom of each page is a small copyright note. Edit its year once in `_layouts/default.html`.

The home page's `contact-links` block contains direct Email and ORCID links. CV stays in the top navigation only.

Keep `CNAME` unchanged (`www.jlsola.com`) unless you are also changing domain settings. Analytics remains in `_includes/google-analytics.html` and is included only in production builds.

## Review without installing anything

The review ZIP includes a `preview` folder. Extract the entire ZIP, then double-click `preview/index.html`. Its page sections share one document and embedded Source Serif 4 fonts, so switching pages does not reload the fonts. The preview waits for the regular and italic faces before showing its text. Navigation, CV, images, and research downloads work locally; external links still require an internet connection.

The `source` folder is the editable GitHub version. Make lasting edits there. It retains separate HTML pages and the shared Jekyll layout; the bundled preview is only a review convenience. The preview is a generated snapshot and does not automatically update after source edits. Do not upload its combined `index.html` in place of the source page.

## Optional Jekyll preview

If you already use Ruby/Jekyll locally:

```bash
gem install jekyll jekyll-seo-tag jekyll-redirect-from jekyll-sitemap
jekyll serve
```

The local server address appears in the terminal. GitHub Pages uses its own pinned versions, so its build remains authoritative. No custom JavaScript framework or dependency installation is required for normal website maintenance.

## Publishing

After reviewing changes, commit and push them to `master`. GitHub Pages rebuilds automatically. Check the result in the repository's Actions tab. The current review does not publish or modify the remote repository.
