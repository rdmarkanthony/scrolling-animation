const _resizeState = { listening: false, callbacks: new Set(), timer: null };
const _scrollState = { listening: false, callbacks: new Set(), ticking: false, event: null };
const _observeState = { observer: null, callbacks: new Map(), initial: new WeakSet() };

const _run = (callbacks, ...args) => callbacks.forEach((callback) => callback(...args));

export const _event = {
    // states: init, ready, resize, after
    resize(callback) {
        if (!_resizeState.listening) {
            _resizeState.listening = true;

            window.addEventListener("load", (e) => _run(_resizeState.callbacks, "ready", e));

            window.addEventListener("resize", (e) => {
                _run(_resizeState.callbacks, "resize", e);

                clearTimeout(_resizeState.timer);
                _resizeState.timer = setTimeout(() => _run(_resizeState.callbacks, "after", e), 300);
            });
        }

        _resizeState.callbacks.add(callback);

        callback("init");
        // if already loaded
        if (document.readyState === "complete") callback("ready");

        return () => _event.offResize(callback);
    },
    offResize(callback) {
        _resizeState.callbacks.delete(callback);
    },

    // once per frame
    scroll(callback) {
        if (!_scrollState.listening) {
            _scrollState.listening = true;

            window.addEventListener(
                "scroll",
                (e) => {
                    _scrollState.event = e;
                    if (_scrollState.ticking) return;

                    _scrollState.ticking = true;
                    requestAnimationFrame(() => {
                        _scrollState.ticking = false;
                        _run(_scrollState.callbacks, _scrollState.event);
                    });
                },
                { passive: true }
            );
        }

        _scrollState.callbacks.add(callback);

        callback();

        return () => _event.offScroll(callback);
    },
    offScroll(callback) {
        _scrollState.callbacks.delete(callback);
    },

    // for element size changes
    observeResize(callback, element = document.body) {
        if (!_observeState.observer) {
            _observeState.observer = new ResizeObserver((entries) => {
                entries.forEach((entry) => {
                    // skip the first report
                    if (_observeState.initial.has(entry.target)) {
                        _observeState.initial.delete(entry.target);
                        return;
                    }

                    _run(_observeState.callbacks.get(entry.target) ?? [], entry);
                });
            });
        }

        if (!_observeState.callbacks.has(element)) {
            _observeState.callbacks.set(element, new Set());
            _observeState.initial.add(element);
            _observeState.observer.observe(element);
        }

        _observeState.callbacks.get(element).add(callback);

        callback();

        return () => _event.offObserveResize(callback, element);
    },
    offObserveResize(callback, element = document.body) {
        const _callbacks = _observeState.callbacks.get(element);
        if (!_callbacks) return;

        _callbacks.delete(callback);
        if (_callbacks.size) return;

        _observeState.observer.unobserve(element);
        _observeState.callbacks.delete(element);
        _observeState.initial.delete(element);
    },

    // emit certain event
    dispatch(elem, eventName, detail) {
        elem.dispatchEvent(new CustomEvent(eventName, { detail }));
    },

    width() {
        return document.documentElement.clientWidth;
    },
    height(isDocument = false) {
        return isDocument ? document.documentElement.scrollHeight : document.documentElement.clientHeight;
    },
};
