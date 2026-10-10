## Scrolling Animation

Scroll-driven animation demos: fixed video background with title sequence, canvas image sequence, and parallax backgrounds.

### Requirements

- Node.js `v20` or later
- npm `v10` or later (or pnpm `v10` or later, e.g. `pnpm install`, `pnpm dev`, `pnpm build`)

### Instructions

1. Clone the repository:
   `git clone https://github.com/rdmarkanthony/scrolling-animation.git`
2. Navigate to the project directory:
   `cd scrolling-animation`
3. Install dependencies:
   `npm install`
4. Start the development server:
   `npm run dev`
5. Build for production:
   `npm run build`

### Troubleshooting

- If you encounter any issues, ensure that you're using the recommended versions of Node.js and npm.
- If problems persist, try deleting the `node_modules` folder and the `package-lock.json` file, then run `npm install` again.

### Output

- Source Nunjucks templates are in `src/_includes/`.
- Page content is in `src/` (`index.njk`, `canvas.njk`, `background.njk`).
- Raw CSS, JS, images, and video are in `src/assets/`.
- Compiled HTML, CSS, JS, images, and video are output to `public/`.
- `npm run build` clears `public/` first, so removed pages never linger in the output.

### Page slots

Pages use `layout: base.njk` in front matter. To add page-specific markup to the layout, use these paired shortcodes anywhere in the page:

- `{% styles %}...{% endstyles %}` – rendered in `<head>` after the main stylesheet
- `{% headerscript %}...{% endheaderscript %}` – rendered at the end of `<head>`
- `{% popup %}...{% endpopup %}` – rendered after `<main>`
- `{% footerscript %}...{% endfooterscript %}` – rendered after the main script

### Page animations

Each page's animation script is in its `{% footerscript %}`, right below the main `script.js`, so a section and its script can be copied together. The comment at the top of each script lists the files it needs.

- Use `<script type="module">` so the page script runs after `script.js`.
- Scripts find elements by `js-` classes (e.g. `js-title-intro`, `js-canvas-section`) or `data-` attributes (e.g. `data-parallax-background`); styling stays in the Tailwind classes.
- Shared hooks handled by `script.js`: `js-links-animate` (on a list of links) or `js-link-animate` (on a link) to scroll to anchors or fade out before leaving, `js-auto-scroll` for anchor links, and `data-aspect-ratio`.
- `script.js` exposes `gsap` and the utils from `src/assets/js/utils/` on `window` (e.g. `_scroller`, `_canvasBanner`, `_parallaxBackground`).

### SEO

Set `url` in `src/_data/site.json` (e.g. `https://example.com`) to enable `og:image`, `og:url` and the canonical link. Pages can set `pageDescription`, `pageKeywords`, `pageImage` and `pageURL` in front matter.

### Environment variables

Variables in `.env` prefixed with `PUBLIC_` are available in `src/assets/js` as `process.env.PUBLIC_*`. Other variables are never bundled.
