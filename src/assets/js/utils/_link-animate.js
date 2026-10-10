import { _autoScroll } from "./_auto-scroll";
import { _scroll } from "./_scroll";

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

        _autoScroll(_content, {
            callback: () => {
                // fix the offset with the header
                setTimeout(() => {
                    const _headerHeight = document.querySelector(".header-content")?.offsetHeight ?? 0;
                    const _afterOffset = (_scroll.offset(_content) - _scroll.top() - _headerHeight) * -1;

                    if (_afterOffset <= 50 && _afterOffset > 0) _autoScroll(_content, { offset: _headerHeight, speed: 200 });
                }, 300);
            },
        });
    }
}
