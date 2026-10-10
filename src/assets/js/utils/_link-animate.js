import { _autoScroll } from "./_auto-scroll";

// disable with data-link-animate="false"
export class _linkAnimate {
    constructor(props) {
        this.target = props.target ?? null;

        if (this.target) this.init();
    }

    init() {
        this.target.addEventListener("click", (e) => this.click(e));
    }

    click(e) {
        if (this.target.dataset.linkAnimate === "false") {
            e.preventDefault();
            return;
        }

        const _anchor = (this.target.getAttribute("href") ?? "").split("#")[1];
        const _content = _anchor && document.getElementById(_anchor.split("?")[0]);
        if (!_content) return;

        e.preventDefault();

        _autoScroll({ target: _content });
    }
}
