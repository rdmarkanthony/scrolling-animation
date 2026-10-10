import { _event } from "./utils/_event";
import { _aspectRatio } from "./utils/_aspect-ratio";
import { _autoScroll } from "./utils/_auto-scroll";
import { _linkAnimate } from "./utils/_link-animate";

import { _home } from "./pages/_home";
import { _canvas } from "./pages/_canvas";
import { _background } from "./pages/_background";

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

        // for aspect ratio
        document.querySelectorAll("[data-aspect-ratio]").forEach((target) => {
            new _aspectRatio({ target });
        });

        // for links animate
        document.querySelectorAll(".links-animate a, .link-animate").forEach((target) => {
            new _linkAnimate({ target });
        });

        // for auto scroll
        document.querySelectorAll(".auto-scroll").forEach((item) => {
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

        // page specific animations, each only runs if its elements exist
        _home.init();
        _canvas.init();
        _background.init();

        if (this.debug) console.log("_scrollingAnimation", this);
    }

    resize(state) {
        // states: init, ready, resize, after
        document.body.style.setProperty("--header-height", `${this.el.header?.offsetHeight ?? 0}px`);
        document.body.style.setProperty("--footer-height", `${this.el.footer?.offsetHeight ?? 0}px`);
    }
}

new _scrollingAnimation({ debug: new URLSearchParams(window.location.search).get("debug") === "true" });
