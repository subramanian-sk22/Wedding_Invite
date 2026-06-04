# Invitation Website

This folder now contains the cleaned local build of the invitation website.

## Main files

- `index.html`: main invite page
- `assets/css/custom.css`: local custom styles added on top of the exported layout
- `assets/js/site.js`: local page behavior for placing the custom event section
- `framerusercontent.com/images`: image assets used by the page
- `framerusercontent.com/assets`: local fonts and audio used by the page
- `fonts.gstatic.com`: font files referenced by the exported font-face rules

## Local preview

Run a simple static server from this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Notes

- Analytics and unused Framer export folders were removed.
- The page still uses the original Framer-generated markup for most of the invite layout.
- Edit `assets/css/custom.css` and `assets/js/site.js` for future custom changes instead of changing the large exported block in `index.html` first.
