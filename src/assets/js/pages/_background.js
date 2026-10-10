import { _parallaxBackground } from "../utils/_parallax-background";
import { _parallaxFloating } from "../utils/_parallax-floating";

export const _background = {
    init() {
        // for parallax background
        document.querySelectorAll("[data-parallax-background]").forEach((target) => {
            new _parallaxBackground({ target });
        });

        // for floating content
        document.querySelectorAll("[data-parallax-floating]").forEach((target) => {
            new _parallaxFloating({ target });
        });
    },
};
