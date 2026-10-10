import { _event } from "./_event";

// usage: data-aspect-ratio="width,height[,minheight][,vertical]" e.g. data-aspect-ratio="1006,1584"
export class _aspectRatio {
    constructor(props) {
        this.target = props.target ?? null;

        const [_width, _height, _minHeight, _vertical] = (this.target?.dataset.aspectRatio ?? "").split(",");
        this.base = {
            width: parseFloat(_width) || 0,
            height: parseFloat(_height) || 0,
            minHeight: _minHeight?.toLowerCase() === "minheight", // set min-height instead of height
            vertical: _vertical?.toLowerCase() === "vertical", // base on parent height instead of width
        };
        this.current = {
            width: 0,
            height: 0,
        };

        if (this.target) this.init();
    }

    init() {
        _event.resize(() => this.update());
    }

    update() {
        const _parent = this.target.parentNode;

        if (this.base.vertical) {
            this.current.height = _parent.offsetHeight;
            this.current.width = Math.round(this.base.width * (this.current.height / this.base.height));
        } else {
            this.current.width = _parent.offsetWidth;
            this.current.height = Math.round(this.base.height * (this.current.width / this.base.width));
        }

        this.target.style.width = `${this.current.width}px`;

        if (this.base.minHeight) {
            this.target.style.minHeight = `${this.current.height}px`;
        } else {
            this.target.style.height = `${this.current.height}px`;
        }
    }
}
