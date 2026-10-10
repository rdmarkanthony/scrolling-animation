import { gsap } from "gsap";
import { _event } from "../utils/_event";
import { _scroll } from "../utils/_scroll";
import { _scroller } from "../utils/_scroller";

// animate the intro section with video banner
export const _home = {
    init() {
        const target = document.querySelector(".section-title-intro");
        if (!target) return;

        new _scroller({
            target,
            init(scroller) {
                scroller.el.sc = scroller.target.querySelector(".com_section-content");
                scroller.el.cover = scroller.target.querySelector(".com_cover-content");
                scroller.el.listWrap = scroller.target.querySelector(".se-ti-in-list");
                scroller.el.list = scroller.target.querySelectorAll(".se-ti-in-list li");
                scroller.currentList = 0;

                _event.resize(() => {
                    scroller.offset.top = _scroll.offset(scroller.el.sc) - _event.height();
                    scroller.offset.bottom = _scroll.offset(scroller.el.sc);
                });
            },
            update(scroller) {
                const _height = _event.height();
                const _scTop = _scroll.offset(scroller.el.sc);

                // animate the video dim cover
                gsap.set(scroller.el.cover, { opacity: 1 - _scroll.clamp(scroller.offset.current) });

                // animate the titles parent container
                // portion of scroller offset.current using %
                // gsap.set(scroller.el.sc, { opacity: _scroll.clamp(scroller.portion("65%", "90%")) });

                // portion of scroller offset using diff containers offsets
                gsap.set(scroller.el.sc, {
                    opacity: _scroll.clamp(scroller.portion(_scTop - _height * 0.4, _scroll.offset(scroller.el.listWrap) - _height * 0.55)),
                });

                let _currentList = 0;

                // determine which title is in the middle of the display, then will add/remove class
                scroller.el.list.forEach((item, index) => {
                    const _offset = _scroll.top() - (_scroll.offset(item) - _scTop) - _height * 0.5 + item.offsetHeight * 0.25;

                    if (_offset >= 0) _currentList = index;

                    if (index !== scroller.currentList) scroller.el.sc.classList.remove(`text-${index}`);
                });

                scroller.currentList = _currentList;
                scroller.el.sc.classList.add(`text-${scroller.currentList}`);
            },
        });
    },
};
