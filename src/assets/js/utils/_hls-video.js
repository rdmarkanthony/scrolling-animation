// usage: <video class="js-hls-video" data-src="name.m3u8" muted loop autoplay playsinline></video>
export class _hlsVideo {
    constructor(props) {
        this.target = props.target ?? null;
        this.src = props.src ?? this.target?.dataset.src ?? "";

        this.hls = null;
        this.observer = null;
        this.visible = false;

        if (this.target && this.src) this.init();
    }

    init() {
        // play only while on screen
        if (this.target.autoplay) {
            this.observer = new IntersectionObserver(([entry]) => {
                this.visible = entry.isIntersecting;
                this.toggle();
            });
            this.observer.observe(this.target);
            this.onVisibility = () => this.toggle();
            document.addEventListener("visibilitychange", this.onVisibility);
        }

        // skip the gap when looping
        this.target.addEventListener("waiting", () => {
            const _buffered = this.target.buffered;
            if (_buffered.length && this.target.currentTime < _buffered.start(0)) this.target.currentTime = _buffered.start(0);
        });

        // use hls.js only if MSE is supported
        const _mse = this.src.endsWith(".m3u8") && ("MediaSource" in window || "ManagedMediaSource" in window);
        if (!_mse) {
            this.target.src = this.src;
            return;
        }

        import("hls.js/light").then(({ default: Hls }) => {
            if (!Hls.isSupported()) {
                this.target.src = this.src;
                return;
            }

            this.hls = new Hls();
            this.hls.loadSource(this.src);
            this.hls.attachMedia(this.target);
        });
    }

    toggle() {
        if (this.visible && document.visibilityState === "visible") {
            this.target.play().catch(() => {});
        } else {
            this.target.pause();
        }
    }

    destroy() {
        this.observer?.disconnect();
        this.observer = null;
        document.removeEventListener("visibilitychange", this.onVisibility);

        this.hls?.destroy();
        this.hls = null;

        this.target.removeAttribute("src");
        this.target.load();
    }
}
