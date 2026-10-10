import { _event } from "./_event";
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
        // set the offsets
        if (props.init) props.init(this);

        if (!props.update) return;

        const _update = (e) => {
            this.update();
            props.update(this, e);
        };

        _event.scroll(_update);
        // for resize
        _event.resize((state, e) => {
            if (state !== "init") _update(e);
        });
    }

    update() {
        // get the progress
        this.offset.current = _scroll.progress(this.offset.top, this.offset.bottom);
    }

    // progress within a range, by percent or scroll position
    portion(min, max) {
        if (typeof min === "string" && min.includes("%")) {
            const _min = parseFloat(min) / 100;
            const _max = parseFloat(max) / 100;

            return (this.offset.current - _min) / (_max - _min);
        }

        return _scroll.progress(min, max);
    }
}
