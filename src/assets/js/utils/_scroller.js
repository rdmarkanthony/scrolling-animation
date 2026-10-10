import { _scroll } from "./_scroll";

export class _scroller {
    constructor(props) {
        this.target = props.target ?? null;

        this.el = {};
        this.offset = {
            top: 0,
            bottom: 0,
            current: 0,
        };

        if (this.target) this.init(props);
    }

    init(props) {
        // set the elements and offset.top/bottom here
        if (props.init) props.init(this);

        if (!props.update) return;

        const _update = (e) => {
            this.update();
            props.update(this, e);
        };

        _update();
        document.addEventListener("scroll", _update);
        window.addEventListener("resize", _update);
    }

    update() {
        // current scroll progress between offset.top and offset.bottom
        this.offset.current = _scroll.progress(this.offset.top, this.offset.bottom);
    }

    // progress within a part of the scroller, either by percent of offset.current ("65%", "90%") or by scroll positions
    portion(min, max) {
        if (typeof min === "string" && min.includes("%")) {
            const _min = parseFloat(min) / 100;
            const _max = parseFloat(max) / 100;

            return (this.offset.current - _min) / (_max - _min);
        }

        return _scroll.progress(min, max);
    }
}
