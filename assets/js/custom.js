'use strict';

const bp = {
	debug: false,
	preloader: true,
	init: function() {
		// for mobile
		if(bp.isMobile()) {
			$('html').addClass('bp-touch');
		}

		if(bp.getUrlVars().debug == 'true') bp.debug = true;

		// for general resize
		bp.resizeFn(function() {
			bp.resize();
		});

		// for ready
		$(document).ready(function() {
			bp.ready();
		});

		bp.header.init();
		bp.footer.init();
		bp.inview.init();

		bp.parallax.init();

		// for aspect ratio
		$('[data-aspect-ratio]').each(function() {
			new bp.aspectRatio({target: this});
		});

		// for links animate
		$('.links-animate a, .link-animate').each(function() {
			new bp.linkAnimate({target: this});
		});

		// for auto scroll
		$('.auto-scroll').each(function() {
			$(this).click(function(e) {
				const _target = document.querySelector(this.getAttribute('href'));

				if(_target) {
					e.preventDefault();

					bp.autoScroll(_target);
				}
			});
		});
		if(window.location.hash) {
			const _hash = ((window.location.hash).split('?'))[0];
			const _target = document.querySelector(_hash);

			if(_target) {
				// for auto scroll
				setTimeout(function() {
					const _targetOffset = bp.st() - $(_target).offset().top;

					// if(!(_targetOffset <= window.innerHeight * 0.2 && _targetOffset >= 0))
					bp.autoScroll(_target, bp.header.target.offsetHeight);
				}, 500);

				// for auto popup
				const _popupBtn = document.querySelector('a[href="'+ _hash +'"]');

				if(_popupBtn) {
					setTimeout(function() {
						_popupBtn.click();
					}, 300);
				}
			}
		}
	},
	ready: function() {
		bp.resize();

		bp.inview.run();
	},
	width: function() {
		return $(window).width();
	},
	height: function() {
		return $(window).height();
	},
	header: {
		target: document.querySelector('.header-content'),
		height: function() {
			return bp.header.target.offsetHeight;
		},
		init: function() {
			
		}
	},
	footer: {
		target: document.querySelector('.footer-content'),
		height: function() {
			return bp.footer.target.offsetHeight;
		},
		init: function() {

		}
	},
	resize: function() {
		// sticky footer
		$(bp.footer.target).css({marginTop: -(bp.footer.height())});
		$('#main-wrapper').css({paddingBottom: bp.footer.height()});

		// for equal height
		$('.group-height').each(function() {
			bp.equalize(this.querySelectorAll('.gh1'));
			bp.equalize(this.querySelectorAll('.gh2'));
			bp.equalize(this.querySelectorAll('.gh3'));
			bp.equalize(this.querySelectorAll('.gh4'));
			bp.equalize(this.querySelectorAll('.gh5'));
		});
	},
	equalize: function(target) {
		for (let i = 0; i < target.length; i++) {
			target[i].style.minHeight = 0;
		}

		let _biggest = 0;
		for (let i = 0; i < target.length; i++ ){
			let element_height = target[i].offsetHeight;
			if(element_height > _biggest ) _biggest = element_height;
		}

		for (let i = 0; i < target.length; i++) {
			target[i].style.minHeight = _biggest + 'px';
		}
		
		return _biggest;
	},
	resizeFn: function(fnctn) {
		let _resizeTimer = '';

		fnctn('init');
		window.addEventListener('resize', function() {
			fnctn('resize');

			clearTimeout(_resizeTimer);
			_resizeTimer = setTimeout(function() {
				fnctn('after');
			}, 300);
		});

		$(document).ready(function() {
			fnctn('ready');
		});
	},
	scrollFn: function(fnctn) {
		fnctn();
		window.addEventListener('scroll', function(e) {
			fnctn(e);
		});
	},
	isMobile: function() {
		const isMobile = {
		    Android: function() {
		        return navigator.userAgent.match(/Android/i);
		    },
		    BlackBerry: function() {
		        return navigator.userAgent.match(/BlackBerry/i);
		    },
		    iOS: function() {
		        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		    },
		    Opera: function() {
		        return navigator.userAgent.match(/Opera Mini/i);
		    },
		    Windows: function() {
		        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
		    },
		    any: function() {
		        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		    }
		};
		if(isMobile.any) {
			return isMobile.any();
		}
	},
	dispatchEvent: function(elem, eventName) {
		let event;
		if (typeof(Event) === 'function') {
			event = new Event(eventName);
		}
		else {
			event = document.createEvent('Event');
			event.initEvent(eventName, true, true);
		}
		elem.dispatchEvent(event);
	},
	getUrlVars: function() {
		let vars = {};
		const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&#]*)/gi, function(m,key,value) {
			vars[key] = value;
		});
		return vars;
	},
	setUrlVars: function(key, value) {
		let url = window.location.href;
		const hash = location.hash;
			url = url.replace(hash, '');
			if (url.indexOf(key + "=") >= 0) {
				const old = ocbc.getUrlVars()[key];
				url = url.replace(key+"="+old, key+"="+value);
			} else {
				if (url.indexOf("?") < 0)
					url += "?" + key + "=" + value;
				else
					url += "&" + key + "=" + value;
			}
			window.history.pushState({ path: url + hash }, '', url + hash );
	},
	inview: {
		init: function() {
			!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){function i(){var b,c,d={height:f.innerHeight,width:f.innerWidth};return d.height||(b=e.compatMode,(b||!a.support.boxModel)&&(c="CSS1Compat"===b?g:e.body,d={height:c.clientHeight,width:c.clientWidth})),d}function j(){return{top:f.pageYOffset||g.scrollTop||e.body.scrollTop,left:f.pageXOffset||g.scrollLeft||e.body.scrollLeft}}function k(){if(b.length){var e=0,f=a.map(b,function(a){var b=a.data.selector,c=a.$element;return b?c.find(b):c});for(c=c||i(),d=d||j();e<b.length;e++)if(a.contains(g,f[e][0])){var h=a(f[e]),k={height:h[0].offsetHeight,width:h[0].offsetWidth},l=h.offset(),m=h.data("inview");if(!d||!c)return;l.top+k.height>d.top&&l.top<d.top+c.height&&l.left+k.width>d.left&&l.left<d.left+c.width?m||h.data("inview",!0).trigger("inview",[!0]):m&&h.data("inview",!1).trigger("inview",[!1])}}}var c,d,h,b=[],e=document,f=window,g=e.documentElement;a.event.special.inview={add:function(c){b.push({data:c,$element:a(this),element:this}),!h&&b.length&&(h=setInterval(k,250))},remove:function(a){for(var c=0;c<b.length;c++){var d=b[c];if(d.element===this&&d.data.guid===a.guid){b.splice(c,1);break}}b.length||(clearInterval(h),h=null)}},a(f).on("scroll resize scrollstop",function(){c=d=null}),!g.addEventListener&&g.attachEvent&&g.attachEvent("onfocusin",function(){d=null})});

			// animate containers that are parents/child
			$('.animate').each(function(index) {
				const _this = this;

				const _dataset = _this.dataset.animate;
				if(_dataset) {
					const _attr = _dataset.split(',');

					// if parent, put index number
					if(_attr[0] == 'parent') {
						$(_this).attr('animate-index', index);
					}

					// if child, group them to its parent
					if(_attr[0] == 'child') {
						$(_this).removeClass('animate');
						const _parentIndex = $(_this).parent().closest('.animate').attr('animate-index');

						if(_parentIndex) {
							$('> *', _this).addClass('animate-child' + _parentIndex);
						}
					}
				}
			});
		},
		run: function() {
			$('.animate').each(function() {
				bp.inview.animate({target: this, clear: true});
			});

			$('.inview').each(function() {
				$(this).one('inview', function(event, visible) {
					if(visible) $(this).addClass('visible');
				});
			});
		},
		animate: function(opt) {
			const _animate = {
				target: null,
				custom: null,
				mobileCustom: null,
				parent: false,
				delay: null,
				index: null,
				init: function() {
					_animate.target = opt.target;

					const _dataset = _animate.target.dataset.animate;
					if(_dataset) {
						const _attr = _dataset.split(',');

						// dont animate the parent
						if(_attr[0] == 'parent') {
							$(_animate.target).removeClass('animate');
							_animate.parent = true;

							// get the parent index
							_animate.index = parseInt(_animate.target.getAttribute('animate-index'));
						}

						// custom css animation
						if(_attr[1]) {
							if(_attr[1] != 'false') _animate.custom = _attr[1];
						}

						// animation delay
						if(_attr[2]) _animate.delay = parseFloat(_attr[2]);

						// if custom css animation for mobile
						if(_attr[3]) {
							if(_attr[3] != 'false') _animate.mobileCustom = _attr[3];
						}
					}

					$(_animate.target).one('inview', function(event, visible) {
						if(visible) {
							if(window.innerWidth <= 768) _animate.custom = _animate.mobileCustom;

							if(_animate.parent) {
								// for parent
								$('.animate-child' + _animate.index).each(function(index) {
									// animate all children at once with delays
									if(index != 0) _animate.delay = _animate.delay + 0.1;

									bp.inview.validate(this, _animate.delay, _animate.custom, opt.clear, _animate.index)
								});

								if(opt.clear) $(_animate.target).removeAttr('animate-index');
							} else {
								// for single
								bp.inview.validate(_animate.target, _animate.delay, _animate.custom, opt.clear);
							}
						}
					});
				}
			}
			_animate.init();
		},
		validate: function(target, delay, custom, clear, index) {
			// add delay
			if(delay) $(target).css('animation-delay', delay + 's');

			if(custom) {
				// add custom animation
				$(target).addClass('anim-custom ' + custom);
			} else {
				// common animation
				$(target).addClass('anim-content');
			}

			// show the animation
			$(target).addClass('visible');

			// remove all animate attributes
			if(clear) {
				setTimeout(function() {
					$(target).removeClass('animate anim-content anim-custom visible');

					if(custom) $(target).removeClass(custom);
					if(index != null) $(target).removeClass('animate-child' + index);

					$(target).css('animation-delay', '');
				}, (0.8 + delay) * 1000);
			}
		}
	},
	aspectRatio: function(opt) {
		const _ar = this;

		_ar.target = '';
		_ar.base = {
			width: 0,
			height: 0,
			minHeight: false,
			vertical: false
		}
		_ar.current = {
			width: 0,
			height: 0
		}

		_ar.init = function() {
			_ar.target = opt.target;

			let _dataset = _ar.target.dataset.aspectRatio;
			if(_dataset) {
				_dataset = _dataset.split(',');

				if(_dataset[0]) _ar.base.width = parseFloat(_dataset[0]);
				if(_dataset[1]) _ar.base.height = parseFloat(_dataset[1]);
				if(_dataset[2]) {
					if((_dataset[2]).toLowerCase() == 'minheight') _ar.base.minHeight = true;
				}
				if(_dataset[3]) {
					if((_dataset[3].toLowerCase() == 'vertical')) _ar.base.vertical = true;
				}
			}

			bp.resizeFn(function() {
				_ar.update();
			});

			_ar.init = null;
			// console.log(_ar);
		}

		_ar.update = function() {
			_ar.current.width = _ar.target.parentNode.offsetWidth;
			_ar.current.height = Math.round(_ar.base.height * (_ar.current.width / _ar.base.width));

			// if vertical or height first
			if(_ar.base.vertical) {
				_ar.current.height = _ar.target.parentNode.offsetHeight;
				_ar.current.width = Math.round(_ar.base.width * (_ar.current.height / _ar.base.height));
			}

			_ar.target.style.width = _ar.current.width + 'px';

			// if height/minHeight
			if(_ar.base.minHeight) {
				_ar.target.style.minHeight =  _ar.current.height + 'px';
			} else {
				_ar.target.style.height =  _ar.current.height + 'px';
			}
		}

		if(opt.target) _ar.init();
	},
	autoScroll: function(target, offset, speed, fnctn) {
		// if need to change the target
		let _diffTarget = target.getAttribute('scroll-diff');
		if(_diffTarget) {
			_diffTarget = $(target).closest(_diffTarget)[0];

			if(_diffTarget) target = _diffTarget;
		}

		let _offset = 0;
		let _gap = 0;
		if(bp.width() <= 768) _gap = 0;
		// if going to scroll up, get header height as offset
		if($(target).offset().top <= bp.st()) {
			_offset = bp.header.height() + _gap;
		} else {
			if(bp.width() > 991) {
				_offset = _gap;
			} else {
				_offset = bp.header.height() + _gap;
			}
		}
		if(parseInt(offset)) _offset = offset;

		let _speed = 700;
		if(parseInt(speed)) _speed = speed;
		
		if(_offset <= 0 && target.dataset.headerNav) _offset = 68;

		$('html').stop().animate({scrollTop: $(target).offset().top -(_offset) }, _speed, false, function() {
			if(fnctn) fnctn();
		});
	},
	linkAnimate: function(opt) {
		const _link = this;

		_link.target = '';

		_link.init = function() {
			_link.target = opt.target;

			$(_link.target).click(function(e) {
				let _href = this.getAttribute('href');

				const _anchor = _href.toString().split('#');
				if(_anchor[1]) {
					const _content = document.querySelector('#' + _anchor[1].split('?')[0]);

					if(_content) {
						e.preventDefault();
						_href = false;

						bp.autoScroll(_content, false, false, function() {
							setTimeout(function() {
								const _afterOffset = (($(_content).offset().top - bp.st()) - bp.header.height()) * -1;
								if(_afterOffset <= 50 && _afterOffset > 0) bp.autoScroll(_content, bp.header.height(), 200);
							}, 300);
						});
					} else {
						_href = false;
					}
				}

				const _mailTo = _href.toString().split(':');
				if(_mailTo[0]) {
					if(_mailTo[0] == 'mailto' || _mailTo[0] == 'tel') _href = false;
				}

				if(_href == '#' || this.getAttribute('target') == '_blank') _href = false;

				if(this.getAttribute('link-animate') == 'false') {
					e.preventDefault();

					_href = false;
				}

				if(_href) {
					e.preventDefault();

					const _cover = document.createElement('div');
					$(_cover).css({zIndex: 9999, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#fff'});
					TweenMax.fromTo(_cover, 0.3, {opacity: 0}, {opacity: 1, onComplete: function() {
						window.open(_href, '_self');
					}});

					document.querySelector('body').appendChild(_cover);
				}
			});

			_link.init = null;
		}
		
		if(opt.target) _link.init();
	},
	st: function() { return window.pageYOffset || document.documentElement.scrollTop },
	abs: function(value) {
		if(value <= 0) value = 0;
		if(value >= 1) value = 1;

		return value;
	},
	getOffsetRange: function(min,max) {
		return (bp.st() - min) / (max - min);
	},
	parallax: {
		lastScroll: 0,
		direction: null,
		init: function() {
			// get direction
			bp.scrollFn(function() {
				if(bp.st() > bp.parallax.lastScroll) {
					bp.parallax.direction = 'down';
				} else {
					bp.parallax.direction = 'up';
				}
				bp.parallax.lastScroll = bp.st() <= 0 ? 0 : bp.st();
			});
		},
		scroller: function(opt) {
			const _scroller = this;

			_scroller.el = {};

			_scroller.offset = {
				top: 0,
				bottom: 0,
				current: 0,
				portion: function(min,max) {
					if(isNaN(min)) {
						min = parseFloat(min.replace('%', '')) / 100;
						max = parseFloat(max.replace('%', '')) / 100;

						return (_scroller.offset.current - min) / (max - min);
					} else {
						return bp.getOffsetRange(min,max);
					}
				}
			};

			_scroller.init = function() {
				_scroller.target = opt.target;
				if(opt.init) opt.init(_scroller);

				if(opt.update) {
					_scroller.update();
					opt.update(_scroller);
					
					document.addEventListener('scroll', function(e) {
						_scroller.update();
						opt.update(_scroller, e);
					});

					window.addEventListener('resize', function(e) {
						_scroller.update();
						opt.update(_scroller, e);
					});
				}

				_scroller.init = null;
			}

			_scroller.update = function() {
				// get current offset by percent
				_scroller.offset.current = bp.getOffsetRange(_scroller.offset.top, _scroller.offset.bottom);
			}

			if(opt.target) _scroller.init();
		},
		background: function(opt) {
			const _bg = this;

			_bg.target = '';
			_bg.range = 500;

			_bg.init = function() {
				_bg.target = opt.target;

				const _dataset = _bg.target.dataset.parallaxBackground;
				if(_dataset) {
					_bg.range = parseInt(_dataset);
				}

				bp.resizeFn(function() {
					_bg.resize();
					_bg.update();
				});

				bp.scrollFn(function() {
					_bg.update();
				});

				_bg.init = null;
				// console.log(_bg);
			}

			_bg.resize = function() {
				$(_bg.target).css({height: ''});
				$(_bg.target).css({height: _bg.target.offsetHeight + (_bg.range * 0.5)});
			}

			_bg.update = function() {
				const _top = $(_bg.target).parent().offset().top - bp.height();
				const _bottom = _top + $(_bg.target).parent().outerHeight() + bp.height();
				const _offset = (_bg.range * bp.abs( bp.getOffsetRange(_top, _bottom) )) - (_bg.range * 0.6);

				TweenMax.set(_bg.target, {y: _offset});
			}

			if(opt.target) _bg.init();
		}
	},
	canvasBanner: function(opt) {
		const _canvas = this;

		_canvas.target = '';
		_canvas.context = '';

		_canvas.image = '';
		_canvas.assets = {
			count: 0,
			list: [],
			path: '',
			type: 'jpg',
			size: [0,0],
			current: 0
		}

		_canvas.init = function() {
			_canvas.target = opt.target;
			_canvas.context = _canvas.target.getContext('2d');

			_canvas.assets.count = opt.assets.count;
			_canvas.assets.path = opt.assets.path;
			if(opt.assets.type) _canvas.assets.type = opt.assets.type;
			_canvas.assets.size = opt.assets.size;

			for (let i = 0; i < _canvas.assets.count; i++) {
				const _src = _canvas.assets.path + ('000' + i).slice(-4) + '.' + _canvas.assets.type;

				const _img = new Image();
				_img.src = _src;

				_canvas.assets.list.push(_src);
			}

			_canvas.target.width = _canvas.assets.size[0];
			_canvas.target.height = _canvas.assets.size[1];

			_canvas.image = new Image();
			_canvas.image.src = _canvas.assets.list[0];
			_canvas.image.onload = function() {
				_canvas.context.drawImage(_canvas.image, 0, 0);
			}

			_canvas.init = null;

			if(opt.init) opt.init(_canvas);
			// console.log(_canvas);
		}

		_canvas.update = function(top, bottom) {
			let _index = Math.round(_canvas.assets.count * bp.getOffsetRange(top, bottom));
			if(_index <= 0) _index = 0;
			if(_index >= _canvas.assets.count - 1) _index = _canvas.assets.count - 1;

			_canvas.assets.current = _index;

			if(_canvas.assets.list[_index]) {
				_canvas.image.src = _canvas.assets.list[_index];
				_canvas.context.drawImage(_canvas.image, 0, 0);
			}
			
			if(bp.debug) console.log(_canvas);
		}

		if(opt.target) _canvas.init();
	}
}
bp.init();