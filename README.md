## Scrolling Animation

Scroll-driven animation demos and the utils behind them: fixed video background with title sequence, canvas image sequence, and parallax backgrounds.

Live demo: https://scrolling-animation.web.app/

### Requirements

- Node.js `v20` or later
- npm `v10` or later, or pnpm `v10` or later

### Usage

```bash
git clone https://github.com/rdmarkanthony/scrolling-animation.git
cd scrolling-animation
npm install
```

- `npm run dev` – starts the dev server at `http://localhost:8080`
- `npm run build` – builds the site to `public/`, ready to deploy

With pnpm, use `pnpm install`, `pnpm dev` and `pnpm build`.

### Files

- `src/index.njk`, `src/canvas.njk`, `src/background.njk` – the demo pages, each with its markup and page script
- `src/assets/js/utils/` – the utils
- `src/assets/js/script.js` – loads the utils and puts them on `window`
- `src/assets/img/`, `src/assets/video/` – the demo images and videos
- `public/` – the built site

### Adding an animation to a page

1. Mark up the section with Tailwind classes. Add `js-` classes for elements the script looks up, and `data-` attributes for options.
2. Add the page script in `{% footerscript %}` so it renders below `script.js`. Use `type="module"` so it runs after it.
3. List the files it needs in a `Requirements` comment, so the section and its script can be copied together.

```njk
<div class="js-fade-section relative min-h-screen bg-black text-white">
    <h2 class="sticky top-0 py-40 text-center text-5xl">Fades in on scroll</h2>
</div>

{% footerscript %}
<script type="module">
    // Requirements
        // JS
            // gsap
            // src/assets/js/utils/_event.js
            // src/assets/js/utils/_parallax.js

    new _parallaxScroller({
        target: document.querySelector(".js-fade-section"),
        events: {
            update(scroller) {
                gsap.set(scroller.target, { opacity: _parallax.clamp(scroller.portion("0%", "50%")) });
            },
        },
    });
</script>
{% endfooterscript %}
```

To use a util in another project, copy its file from `src/assets/js/utils/` together with `_event.js`, and install `gsap` (and `hls.js` for videos).

## Functions

`script.js` exposes `gsap` and every util below on `window`, so page scripts can use them without imports.

### \_parallaxScroller

`src/assets/js/utils/_parallax.js`

Measures the target on resize, then on scroll only does the math, at most once per frame. All the other scroll utils are built on it.

```js
const scroller = new _parallaxScroller({
    target: document.querySelector(".js-my-section"),
    events: {
        // once, before measuring
        init(scroller) {},
        // after measuring, change the range here
        resize(scroller) {
            const _offset = _parallax.getOffset(scroller.target);
            scroller.offset.top = _offset.top;
            scroller.offset.bottom = _offset.bottom - _event.height();
        },
        // on scroll
        update(scroller) {
            const _progress = _parallax.clamp(scroller.portion("20%", "60%"));
            gsap.set(scroller.target, { scale: 0.8 + _progress * 0.2 });
        },
    },
});

scroller.on("update", (scroller) => {}); // more listeners, remove with off()
scroller.destroy();
```

- `offset.current` – 0 when the target enters the screen and 1 when it leaves, unclamped
- `offset.top`, `offset.bottom` – the scroll positions for 0 and 1, change them in `resize` for another range. The example above runs from the section's top until its end reaches the bottom of the screen, for a sticky section.
- `portion(min, max)` – progress within part of the range, as percents of `offset.current` (`'20%', '60%'`) or as scroll positions (`500, 1200`)

### \_parallaxBackground

`src/assets/js/utils/_parallax.js`

A background that moves slower than the page. It's made `range` pixels taller than its `overflow-hidden` parent and moves from `-range` to 0 as the parent crosses the screen.

```html
<section class="relative min-h-screen">
    <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-cover bg-center" data-parallax-background="100,easing" style="background-image: url('/assets/img/banner1.jpg')"></div>
    </div>
</section>
```

```js
document.querySelectorAll("[data-parallax-background]").forEach((target) => {
    new _parallaxBackground({ target });
});
```

- `data-parallax-background="range,easing"` – range in px (default `500`), add `easing` to make it trail behind the scroll a little
- Without the attribute values, use props: `new _parallaxBackground({ target, range: 100, easing: true })`

### \_parallaxFloating

`src/assets/js/utils/_parallax.js`

An element that drifts down by its range as it crosses the screen, eased. Keep it in an `overflow-hidden` wrapper if it shouldn't spill out.

```html
<div class="relative overflow-hidden">
    <img data-parallax-floating="80" src="/assets/img/banner1.jpg" alt="" />
</div>
```

```js
document.querySelectorAll("[data-parallax-floating]").forEach((target) => {
    new _parallaxFloating({ target });
});
```

- `data-parallax-floating="range"` – range in px (default `50`), or the `range` prop

`_parallaxBackground` and `_parallaxFloating` stay still when reduced motion is on, and both have `destroy()`.

### \_canvasBanner

`src/assets/js/utils/_canvasBanner.js`

Loads an image sequence and draws the frame for a progress from 0 to 1. Pair it with `_parallaxScroller` to scrub through the frames on scroll.

```html
<section class="js-canvas-section relative min-h-[300vh]">
    <div class="sticky top-0 flex h-screen items-center justify-center p-6">
        <canvas class="js-canvas"></canvas>
    </div>
</section>
```

```js
const canvas = new _canvasBanner({
    target: document.querySelector(".js-canvas"),
    assets: {
        count: 50,
        path: "/assets/img/headphone/large_",
        digits: 4,
        size: [1004, 1214],
        resizeMode: "contain",
        // below 768px wide
        mobile: {
            path: "/assets/img/headphone/small_",
            type: "webp",
            size: [502, 607],
            step: 2,
        },
    },
    transition: { duration: 150 },
});

new _parallaxScroller({
    target: document.querySelector(".js-canvas-section"),
    events: {
        resize(scroller) {
            const _offset = _parallax.getOffset(scroller.target);
            scroller.offset.top = _offset.top;
            scroller.offset.bottom = _offset.bottom - _event.height();
        },
        update(scroller) {
            canvas.update(scroller.offset.current);
        },
    },
});
```

Frames are named `path` + a zero-padded number + `.type`, starting at 0, e.g. `large_0000.jpg` to `large_0049.jpg`.

- `assets.count` – number of frames
- `assets.path` – frame path without the number
- `assets.type` – file extension (default `jpg`)
- `assets.digits` – zero-padding length (default: digits of the last frame number)
- `assets.size` – `[width, height]` of the frames
- `assets.resizeMode` – `width` (default) fills the parent's width, `height` fills its height, `contain` fits inside it
- `assets.step` – use every nth frame (default `1`), e.g. `2` for half the frames, the last frame is always kept
- `assets.buffer` – frames kept loaded before and after the current one (default `20`), further ones are unloaded to save memory
- `assets.mobile` – any of `path`, `type`, `size`, `step`, `buffer` to use instead below 768px wide, or when `media` matches, e.g. `media: "(max-width: 1023px)"`
- `transition.duration` – crossfade between frames in ms (default `0`)
- `events` – `init`, `resize`, `beforeUpdate`, `afterUpdate`, or add them with `on()` / `off()`

The canvas sizes itself to its parent's content box, sharp on high density screens but never bigger than the frames.

Frames are decoded before they're drawn (off the main thread with `fetch` and `createImageBitmap`), nearest to the current frame first. Until a frame is ready the nearest loaded one is drawn, so fast scrolling never waits. Frames on another domain need CORS headers for `fetch`, otherwise they load as plain images. On phones, use the `mobile` option for frames about half the size: each decoded frame takes width × height × 4 bytes of memory, so 50 frames at 1004×1214 take about 240MB.

### \_hlsVideo

`src/assets/js/utils/_hlsVideo.js`

Plays HLS videos (`.m3u8` playlist + `.ts` segments). `script.js` sets it up for every `.js-hls-video`, so only the markup is needed.

```html
<video class="js-hls-video" data-src="/assets/video/name/name.m3u8" muted loop autoplay playsinline></video>
```

- `hls.js` plays the video where the browser supports Media Source Extensions, other browsers (e.g. iOS Safari) play the playlist natively. It's split into its own chunk, so it only downloads on pages with a video.
- The video loads when it gets within a screen of the viewport. Pass `lazy: false` to load it right away.
- An `autoplay` video plays only while it's on screen and the tab is visible, and not with reduced motion.

Videos go in `src/assets/video/<name>/`. Convert an `.mp4` (H.264) without re-encoding, audio removed for muted background videos:

```bash
ffmpeg -i name.mp4 -an -c:v copy -hls_time 4 -hls_playlist_type vod -hls_segment_filename "name/name%d.ts" name/name.m3u8
```

If the source isn't H.264, or its keyframes are far apart (long segments), re-encode instead: replace `-c:v copy` with `-c:v libx264 -crf 23 -preset slow -g 60`.

### \_autoScroll

`src/assets/js/utils/_autoScroll.js`

Smooth scrolls to an element. `script.js` sets it up for every `.js-auto-scroll` link, and for the hash in the URL on load.

```html
<a class="js-auto-scroll" href="#intro">See the intro demo</a>
```

```js
_autoScroll({
    target: document.getElementById("intro"),
    offset: 0, // default: the header's height, if it's fixed or sticky
    speed: 500, // in ms
    ease: "power2.out",
    callback({ target, direction, offset, y }) {},
});
```

- Add `data-scroll-parent=".selector"` to the target to scroll to its closest matching parent instead.
- The header is `.header-content`. Its height is only used as the offset when it's `fixed` or `sticky`.
- Jumps straight there with reduced motion.

### \_parallax

`src/assets/js/utils/_parallax.js`

Helpers the scroll utils are built on.

```js
_parallax.scrollTop(); // current scroll position
_parallax.getOffset(el); // { top, left, bottom, right } in the document, transforms ignored
_parallax.getRange(min, max); // 0 at min, 1 at max, unclamped
_parallax.clamp(value); // limit to 0 - 1
```

### \_event

`src/assets/js/utils/_event.js`

Keeps one scroll and one resize listener for the whole page, however many callbacks are added. Every subscribe runs the callback once right away and returns a function that removes it.

```js
_event.resize((state) => {}); // state: init, ready, resize, after, skips the phone address bar showing or hiding
_event.scroll((e) => {}); // at most once per frame while scrolling
_event.observeResize((entry) => {}, el); // el changes size, e.g. images load above it (default: body)

const off = _event.scroll(callback);
off();

_event.width(); // viewport size without the scrollbar
_event.height(); // pass true for the document height
_event.dispatch(el, "visible", { index: 1 }); // listeners read e.detail
```
