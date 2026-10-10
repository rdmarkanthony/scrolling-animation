export const _scroll = {
    // current scroll position
    top() {
        return window.scrollY;
    },
    // element top position relative to the document
    offset(target) {
        return target.getBoundingClientRect().top + window.scrollY;
    },
    // scroll progress between two scroll positions, 0 at min and 1 at max (not clamped)
    progress(min, max) {
        return (this.top() - min) / (max - min);
    },
    // limit the value between 0 and 1
    clamp(value) {
        return Math.min(Math.max(value, 0), 1);
    },
};
