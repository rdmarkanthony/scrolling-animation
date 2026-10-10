export const _scroll = {
    // current scroll position
    top() {
        return window.scrollY;
    },
    // element top in the document
    offset(target) {
        return target.getBoundingClientRect().top + window.scrollY;
    },
    // progress, 0 at min and 1 at max
    progress(min, max) {
        return (this.top() - min) / (max - min);
    },
    // limit between 0 and 1
    clamp(value) {
        return Math.min(Math.max(value, 0), 1);
    },
};
