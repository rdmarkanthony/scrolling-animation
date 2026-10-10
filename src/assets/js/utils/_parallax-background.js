import { gsap } from "gsap";
import { _event } from "./_event";
import { _scroll } from "./_scroll";

// usage: data-parallax-background="range,easing"
export class _parallaxBackground {
    constructor(props) {
        this.target = props.target ?? null;

        const [_range, _easing] = (this.target?.dataset.parallaxBackground ?? "").split(",");
        this.range = Number.isInteger(parseInt(_range)) ? parseInt(_range) : (props.range ?? 500);
        this.easing = _easing === "easing" || (props.easing ?? false);

        if (this.target) this.init();
    }

    init() {
        this.target.style.willChange = "transform";

        _event.resize(() => {
            this.resize();
            this.update();
        });

        _event.scroll(() => this.update());
    }

    resize() {
        // add room to move
        this.target.style.height = "";
        this.target.style.height = `${this.target.offsetHeight + this.range * 0.5}px`;
    }

    update() {
        const _parent = this.target.parentElement;
        const _top = _scroll.offset(_parent) - _event.height();
        const _bottom = _top + _parent.offsetHeight + _event.height();

        const _percent = this.easing ? 0.7 : 0.6;
        const _offset = this.range * _scroll.clamp(_scroll.progress(_top, _bottom)) - this.range * _percent;

        if (this.easing) {
            gsap.to(this.target, { duration: 0.5, y: _offset, delay: 0.05 });
        } else {
            gsap.set(this.target, { y: _offset });
        }
    }
}
