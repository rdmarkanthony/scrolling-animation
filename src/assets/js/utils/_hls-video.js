// usage: <video class="js-hls-video" data-src="/assets/video/name/name.m3u8" muted loop autoplay playsinline></video>
// convert a video with: ffmpeg -i name.mp4 -an -c:v copy -hls_time 4 -hls_playlist_type vod -hls_segment_filename "name/name%d.ts" name/name.m3u8
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
        // autoplay only while on screen, browsers can leave a muted autoplay video paused when it starts offscreen
        if (this.target.autoplay) {
            this.observer = new IntersectionObserver(([entry]) => {
                this.visible = entry.isIntersecting;
                this.toggle();
            });
            this.observer.observe(this.target);
            this.onVisibility = () => this.toggle();
            document.addEventListener("visibilitychange", this.onVisibility);
        }

        // looping back lands before the first frame when the encode starts late, hop over the gap
        this.target.addEventListener("waiting", () => {
            const _buffered = this.target.buffered;
            if (_buffered.length && this.target.currentTime < _buffered.start(0)) this.target.currentTime = _buffered.start(0);
        });

        // hls.js only matters where MSE exists, chrome claims native hls but can fail on it
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
