## Scrolling Animation

Scroll-driven animation demos: fixed video background with title sequence, canvas image sequence, and parallax backgrounds.

### Requirements

- Node.js `v20` or later
- npm `v10` or later

### Instructions

1. Clone the repository:
   `git clone https://github.com/rdmarkanthony/scrolling-animation.git`
2. Navigate to the project directory:
   `cd scrolling-animation`
3. Install dependencies:
   `npm install`
4. Start the development server:
   `npm start`
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
