import { _event } from "./_event";

// usage: new _canvasBanner({ target, assets: { count, path, type, digits, size, resizeMode }, transition: { duration }, events })
export class _canvasBanner {
    constructor(props) {
        this.target = props.target ?? null;
        this.context = this.target?.getContext("2d");

        this.image = null;
        this.assets = {
            count: props.assets?.count ?? 0,
            list: [],
            path: props.assets?.path ?? "",
            type: props.assets?.type ?? "jpg",
            digits: props.assets?.digits ?? String((props.assets?.count ?? 1) - 1).length,
            size: props.assets?.size ?? [0, 0],
            resizeMode: props.assets?.resizeMode ?? "width", // width, height or contain
            current: 0,
        };

        this.debug = props.debug ?? false;

        this.transition = {
            duration: props.transition?.duration ?? 0,
            raf: null,
            active: false,
        };

        this.events = props.events ?? {};
        this.listeners = {};
        this.unsubscribe = [];

        if (this.target) this.init();
    }

    init() {
        // get all the images
        for (let i = 0; i < this.assets.count; i++) {
            const _img = new Image();
            _img.src = `${this.assets.path}${String(i).padStart(this.assets.digits, "0")}.${this.assets.type}`;

            this.assets.list.push(_img);
        }

        // load the first image
        this.image = this.assets.list[0];
        this.loaded(this.image, () => this.draw());

        // for resize
        this.unsubscribe.push(_event.observeResize(() => this.resize(), this.target.parentElement));

        this.emit("init");
    }

    // progress from 0 (first frame) to 1 (last frame)
    update(progress = 0) {
        const _index = Math.round(Math.min(Math.max(progress, 0), 1) * (this.assets.count - 1));
        if (_index === this.assets.current || !this.assets.list[_index]) return;

        this.emit("beforeUpdate");

        const _previousImage = this.image;
        const _nextImage = this.assets.list[_index];

        this.image = _nextImage;
        this.assets.current = _index;

        // skip if another frame was picked while loading
        this.loaded(_nextImage, () => {
            if (this.image === _nextImage) this.fade(_previousImage, _nextImage);
        });

        if (this.debug) console.log(this);
        this.emit("afterUpdate");
    }

    fade(previousImage, nextImage) {
        cancelAnimationFrame(this.transition.raf);

        if (!this.transition.duration) {
            this.transition.active = false;
            this.draw(nextImage);
            return;
        }

        this.transition.active = true;

        const _start = performance.now();

        const _animate = (time) => {
            const _progress = Math.min((time - _start) / this.transition.duration, 1);

            // the next image fades in over the previous one
            this.draw(previousImage);
            this.draw(nextImage, _progress, false);

            if (_progress < 1) {
                this.transition.raf = requestAnimationFrame(_animate);
            } else {
                this.transition.active = false;
                this.transition.raf = null;
            }
        };

        this.transition.raf = requestAnimationFrame(_animate);
    }

    draw(image = this.image, alpha = 1, clear = true) {
        if (!image?.complete || !image.naturalWidth) return;

        if (clear) this.context.clearRect(0, 0, this.target.width, this.target.height);

        this.context.globalAlpha = alpha;
        this.context.drawImage(image, 0, 0, this.target.width, this.target.height);
        this.context.globalAlpha = 1;
    }

    resize() {
        const _parent = this.target.parentElement;
        if (!_parent) return;

        // parent content box, without the padding
        const _style = getComputedStyle(_parent);
        const _parentWidth = _parent.clientWidth - parseFloat(_style.paddingLeft) - parseFloat(_style.paddingRight);
        const _parentHeight = _parent.clientHeight - parseFloat(_style.paddingTop) - parseFloat(_style.paddingBottom);

        const _ratio = this.assets.size[1] / this.assets.size[0];

        let _width = _parentWidth;
        if (this.assets.resizeMode === "height") _width = _parentHeight / _ratio;
        if (this.assets.resizeMode === "contain") _width = Math.min(_parentWidth, _parentHeight / _ratio);

        const _height = _width * _ratio;
        if (!_width) return;

        this.target.style.width = `${_width}px`;
        this.target.style.height = `${_height}px`;

        // sharp on high density screens, but no bigger than the images
        const _scale = Math.min(window.devicePixelRatio || 1, this.assets.size[0] / _width);
        this.target.width = Math.round(_width * _scale);
        this.target.height = Math.round(_height * _scale);

        if (!this.transition.active) this.draw();

        this.emit("resize");
    }

    loaded(image, callback) {
        if (image.complete && image.naturalWidth) {
            callback();
        } else {
            image.addEventListener("load", callback, { once: true });
        }
    }

    // register event listener
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = new Set();
        this.listeners[event].add(callback);
    }

    // remove event listener
    off(event, callback) {
        this.listeners[event]?.delete(callback);
    }

    // emit certain event
    emit(event) {
        this.events[event]?.(this);
        this.listeners[event]?.forEach((callback) => callback(this));
    }

    destroy() {
        cancelAnimationFrame(this.transition.raf);
        this.unsubscribe.forEach((off) => off());
        this.unsubscribe = [];
        this.listeners = {};
    }
}
