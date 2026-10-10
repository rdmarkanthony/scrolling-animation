import { gsap } from "gsap";
import { _event } from "./_event";
import { _scroll } from "./_scroll";

// usage: data-parallax-floating="range" e.g. data-parallax-floating="80"
export class _parallaxFloating {
    constructor(props) {
        this.target = props.target ?? null;

        const _range = parseInt(this.target?.dataset.parallaxFloating);
        this.range = Number.isNaN(_range) ? (props.range ?? 50) : _range;

        if (this.target) this.init();
    }

    init() {
        this.target.style.willChange = "transform";

        _event.scroll(() => this.update());
    }

    update() {
        const _top = _scroll.offset(this.target) - _event.height();
        const _bottom = _top + this.target.offsetHeight + _event.height();

        const _offset = _scroll.clamp(_scroll.progress(_top, _bottom));

        gsap.to(this.target, { duration: 0.5, y: this.range * _offset, delay: 0.05 });
    }
}
