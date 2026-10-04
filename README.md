# Andrew Russell — portfolio

A static portfolio for Andrew’s three active projects: Cost Mapping, stream.sh, and Bastion Character Workshop.

The public site lives in `docs/`. It contains no personal contact details, analytics, externally loaded fonts, or server-side dependencies. Project introductions link to their source repositories. Three small browser examples demonstrate trip economics, streaming profiles, and sample-career generation.

## Preview

```sh
python3 -m http.server 8767 --bind 127.0.0.1 --directory docs
```

Open `http://127.0.0.1:8767`.

## Check

```sh
python3 scripts/check_site.py
node --check docs/assets/site.js
node scripts/check_examples.mjs
```

The checks cover local links/assets, contact-detail exclusions, and the working examples. The page’s content and repository links remain available without JavaScript.

## GitHub Pages

Repository: `andrew-g-r/andrew-g-r.github.io`.

In **Settings → Pages**, choose **Deploy from a branch**, then **main /docs**. The published URL is `https://andrew-g-r.github.io/`. `.nojekyll` keeps the files static. Each push to `main` updates the site.

## Content and design

Edit the project introductions in `docs/index.html`, the visual theme in `docs/assets/site.css`, and the small examples in `docs/assets/site.js`.

The typography takes inspiration from `davidrussell.dev`; personal content and photographs are not reused. Source Sans 3 and Source Serif 4 are bundled under their accompanying SIL Open Font Licenses. The cost-surface graphic is derived from Cost Mapping’s legacy sample data and is labeled as a demonstration. Career names are from the existing sample catalog; Electric Bastionland is by Chris McDowall.

`cost-topology` is the earlier notebook for Cost Mapping and is deliberately omitted from the portfolio.
