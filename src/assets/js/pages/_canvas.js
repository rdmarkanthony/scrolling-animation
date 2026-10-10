import { _event } from "../utils/_event";
import { _scroll } from "../utils/_scroll";
import { _canvasBanner } from "../utils/_canvas-banner";

// image sequence drawn on canvas while scrolling
export const _canvas = {
    init() {
        const target = document.querySelector("#headphone");
        if (!target) return;

        new _canvasBanner({
            target,
            assets: {
                count: 50,
                path: "/assets/img/headphone/large_",
                size: [1004, 1214],
            },
            init(canvas) {
                const _parent = canvas.target.closest(".section");

                _event.scroll(() => {
                    const _top = _scroll.offset(_parent);

                    canvas.update(_top, _top + _parent.offsetHeight * 0.4);
                });
            },
        });
    },
};
