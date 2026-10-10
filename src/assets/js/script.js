import { gsap } from "gsap";

import { _event } from "./utils/_event";
import { _scroll } from "./utils/_scroll";
import { _scroller } from "./utils/_scroller";
import { _parallaxBackground } from "./utils/_parallax-background";
import { _parallaxFloating } from "./utils/_parallax-floating";
import { _canvasBanner } from "./utils/_canvas-banner";
import { _autoScroll } from "./utils/_auto-scroll";
import { _linkAnimate } from "./utils/_link-animate";
import { _hlsVideo } from "./utils/_hls-video";

// expose for inline scripts, see each page's {% footerscript %}
Object.assign(window, {
    gsap,
    _event,
    _scroll,
    _scroller,
    _parallaxBackground,
    _parallaxFloating,
    _canvasBanner,
    _autoScroll,
    _linkAnimate,
    _hlsVideo,
});

class _scrollingAnimation {
    constructor(props) {
        if (window._scrollingAnimation) return;
        window._scrollingAnimation = this;

        this.debug = props.debug || false;

        this.el = {
            header: document.querySelector(".header-content"),
            footer: document.querySelector(".footer-content"),
            main: document.querySelector(".main-content"),
        };

        this.init();
    }

    init() {
        // for resize
        _event.resize((state) => this.resize(state));

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
                _autoScroll(_target);
            });
        });

        // scroll to the hash on load
        const _hashTarget = window.location.hash && document.getElementById(window.location.hash.slice(1).split("?")[0]);
        if (_hashTarget) setTimeout(() => _autoScroll(_hashTarget, { offset: this.el.header?.offsetHeight }), 500);

        if (this.debug) console.log("_scrollingAnimation", this);
    }

    resize(state) {
        // states: init, ready, resize, after
    }
}

new _scrollingAnimation({ debug: new URLSearchParams(window.location.search).get("debug") === "true" });
