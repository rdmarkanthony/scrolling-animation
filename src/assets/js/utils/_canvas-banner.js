import { _scroll } from "./_scroll";

// draws an image sequence on a canvas, call update(top, bottom) to pick the frame by scroll position
export class _canvasBanner {
    constructor(props) {
        this.target = props.target ?? null;
        this.context = null;

        this.assets = {
            count: props.assets?.count ?? 0,
            path: props.assets?.path ?? "", // frames are named path + 0000 + .type
            type: props.assets?.type ?? "jpg",
            size: props.assets?.size ?? [0, 0],
            images: [],
            current: 0,
        };

        if (this.target) this.init(props.init);
    }

    init(callback) {
        this.context = this.target.getContext("2d");

        this.target.width = this.assets.size[0];
        this.target.height = this.assets.size[1];

        // preload all frames
        for (let i = 0; i < this.assets.count; i++) {
            const _img = new Image();
            _img.src = `${this.assets.path}${String(i).padStart(4, "0")}.${this.assets.type}`;

            // draw once loaded if it's the current frame
            _img.addEventListener("load", () => {
                if (i === this.assets.current) this.draw();
            });

            this.assets.images.push(_img);
        }

        if (callback) callback(this);
    }

    update(top, bottom) {
        const _index = Math.round(this.assets.count * _scroll.progress(top, bottom));

        this.assets.current = Math.min(Math.max(_index, 0), this.assets.count - 1);
        this.draw();
    }

    draw() {
        const _img = this.assets.images[this.assets.current];

        if (_img?.complete && _img.naturalWidth) this.context.drawImage(_img, 0, 0);
    }
}
