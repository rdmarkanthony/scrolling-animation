import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { _event } from "./_event";
import { _scroll } from "./_scroll";

gsap.registerPlugin(ScrollToPlugin);

// smooth scroll to the target, leaving room for the header
export const _autoScroll = (target, props = {}) => {
    // scroll-diff="selector" scrolls to the closest matching parent instead
    const _diffTarget = target.getAttribute("scroll-diff");
    if (_diffTarget) target = target.closest(_diffTarget) ?? target;

    const _headerHeight = document.querySelector(".header-content")?.offsetHeight ?? 0;

    // keep the header gap when scrolling up, or on tablet and below
    let _offset = _scroll.offset(target) <= _scroll.top() || _event.width() <= 991 ? _headerHeight : 0;
    if (parseInt(props.offset)) _offset = props.offset;
    if (_offset <= 0 && target.dataset.headerNav) _offset = 68;

    const _speed = parseInt(props.speed) || 700;

    gsap.to(window, {
        duration: _speed / 1000,
        scrollTo: { y: _scroll.offset(target) - _offset },
        ease: "sine.inOut",
        overwrite: true,
        onComplete: () => props.callback?.(),
    });
};
