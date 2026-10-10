import { bp } from "./utils/_bp";
import { home } from "./pages/_home";
import { canvas } from "./pages/_canvas";
import { background } from "./pages/_background";

document.addEventListener("DOMContentLoaded", () => {
    bp.init();

    // page specific animations, each only runs if its elements exist
    home.init();
    canvas.init();
    background.init();
});
