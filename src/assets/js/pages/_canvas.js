import $ from "jquery";
import { bp } from "../utils/_bp";

// image sequence drawn on canvas while scrolling
export const canvas = {
    init() {
        const target = document.querySelector("#headphone");
        if (!target) return;

        new bp.canvasBanner({
            target,
            assets: {
                count: 50,
                path: "/assets/img/headphone/large_",
                size: [1004, 1214],
            },
            init(canvas) {
                const _parent = $(canvas.target).closest(".section");

                bp.scrollFn(() => {
                    canvas.update(_parent.offset().top, _parent.offset().top + _parent.outerHeight() * 0.4);
                });
            },
        });
    },
};
