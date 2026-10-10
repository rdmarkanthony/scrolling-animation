import { gsap } from "gsap";

import { _event } from "./utils/_event";
import { _parallax, _parallaxScroller, _parallaxBackground, _parallaxFloating } from "./utils/_parallax";
import { _canvasBanner } from "./utils/_canvas-banner";
import { _autoScroll } from "./utils/_auto-scroll";
import { _linkAnimate } from "./utils/_link-animate";
import { _hlsVideo } from "./utils/_hls-video";

// expose for inline scripts
Object.assign(window, {
    gsap,
    _event,
    _parallax,
    _parallaxScroller,
    _parallaxBackground,
    _parallaxFloating,
    _canvasBanner,
    _autoScroll,
    _linkAnimate,
    _hlsVideo,
});

// for links animate
document.querySelectorAll(".js-links-animate a, .js-link-animate").forEach((target) => {
    new _linkAnimate({ target });
});

// for hls videos
document.querySelectorAll(".js-hls-video").forEach((target) => {
    new _hlsVideo({ target });
});

// for auto scroll
document.querySelectorAll(".js-auto-scroll").forEach((item) => {
    item.addEventListener("click", (e) => {
        const _href = item.getAttribute("href") ?? "";
        const _target = _href.startsWith("#") && document.getElementById(_href.slice(1));
        if (!_target) return;

        e.preventDefault();
        _autoScroll({ target: _target });
    });
});

// for hash on load
const _hashTarget = window.location.hash && document.getElementById(window.location.hash.slice(1).split("?")[0]);
if (_hashTarget) setTimeout(() => _autoScroll({ target: _hashTarget }), 500);
