import { bp } from "../utils/_bp";

export const background = {
    init() {
        // for parallax background
        document.querySelectorAll("[data-parallax-background]").forEach((target) => {
            new bp.parallax.background({ target });
        });

        // for floating content
        document.querySelectorAll("[data-parallax-floating]").forEach((target) => {
            new bp.parallax.floating({ target });
        });
    },
};
