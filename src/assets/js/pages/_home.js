import $ from "jquery";
import { gsap } from "gsap";
import { bp } from "../utils/_bp";

// animate the intro section with video banner
export const home = {
    init() {
        const target = document.querySelector(".section-title-intro");
        if (!target) return;

        new bp.parallax.scroller({
            target,
            init(scroller) {
                scroller.el.sc = scroller.target.querySelector(".com_section-content");
                scroller.el.cover = scroller.target.querySelector(".com_cover-content");

                scroller.el.list = scroller.target.querySelectorAll(".se-ti-in-list li");
                scroller.currentList = 0;

                bp.resizeFn(() => {
                    scroller.offset.top = $(scroller.el.sc).offset().top - bp.height();
                    scroller.offset.bottom = $(scroller.el.sc).offset().top;
                });
            },
            update(scroller) {
                // animate the video dim cover
                gsap.set(scroller.el.cover, { opacity: 1 - bp.abs(scroller.offset.current) });

                // animate the titles parent container
                // portion of scroller offset.current using %
                // gsap.set(scroller.el.sc, { opacity: bp.abs(scroller.offset.portion("65%", "90%")) });

                // portion of scroller offset using diff containers offsets
                gsap.set(scroller.el.sc, {
                    opacity: bp.abs(scroller.offset.portion($(scroller.el.sc).offset().top - bp.height() * 0.4, $(".se-ti-in-list", scroller.target).offset().top - bp.height() * 0.55)),
                });

                let _currentList = 0;

                // determine which title is in the middle of the display, then will add/remove class
                $(scroller.el.list).each(function (index) {
                    const _offset = bp.st() - ($(this).offset().top - $(scroller.el.sc).offset().top) - bp.height() * 0.5 + this.offsetHeight * 0.25;

                    if (_offset >= 0) _currentList = index;

                    if (index != scroller.currentList) $(scroller.el.sc).removeClass("text-" + index);
                });

                if (_currentList != scroller.currentList) scroller.currentList = _currentList;
                $(scroller.el.sc).addClass("text-" + scroller.currentList);
            },
        });
    },
};
