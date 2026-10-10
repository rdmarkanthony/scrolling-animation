import { gsap } from "gsap";
import { _autoScroll } from "./_auto-scroll";
import { _scroll } from "./_scroll";

// links: scroll to anchors on the page, or fade the page out before leaving
// skip with data-link-animate="false"
export class _linkAnimate {
    constructor(props) {
        this.target = props.target ?? null;

        if (this.target) this.init();
    }

    init() {
        this.target.addEventListener("click", (e) => this.click(e));
    }

    click(e) {
        const _href = this.target.getAttribute("href") ?? "";
        const _disabled = this.target.dataset.linkAnimate === "false";

        // anchor on this page, scroll to it
        const _anchor = _href.split("#")[1];
        if (_anchor) {
            const _content = document.getElementById(_anchor.split("?")[0]);

            if (_content || _disabled) e.preventDefault();
            if (_content) {
                _autoScroll(_content, {
                    callback: () => {
                        // correct the position if the header ends up covering the content
                        setTimeout(() => {
                            const _headerHeight = document.querySelector(".header-content")?.offsetHeight ?? 0;
                            const _afterOffset = (_scroll.offset(_content) - _scroll.top() - _headerHeight) * -1;

                            if (_afterOffset <= 50 && _afterOffset > 0) _autoScroll(_content, { offset: _headerHeight, speed: 200 });
                        }, 300);
                    },
                });
            }

            return;
        }

        if (_disabled) {
            e.preventDefault();
            return;
        }

        // let these work as normal links
        const _protocol = _href.split(":")[0];
        if (!_href || _href === "#" || ["mailto", "tel"].includes(_protocol) || this.target.getAttribute("target") === "_blank") return;

        e.preventDefault();

        // fade the page out before leaving
        const _cover = document.createElement("div");
        Object.assign(_cover.style, { zIndex: 9999, position: "fixed", inset: 0, backgroundColor: "#fff" });
        document.body.appendChild(_cover);

        gsap.fromTo(_cover, { opacity: 0 }, { duration: 0.3, opacity: 1, onComplete: () => window.open(_href, "_self") });
    }
}
