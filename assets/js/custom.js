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
	st: function() { return window.pageYOffset || document.documentElement.scrollTop },
	parallax: {
		st: function() { return window.pageYOffset || document.documentElement.scrollTop },
		lastScroll: 0,
		direction: null,
		init: function() {
			// get direction
			bp.scrollFn(function() {
				if(bp.parallax.st() > bp.parallax.lastScroll) {
					bp.parallax.direction = 'down';
				} else {
					bp.parallax.direction = 'up';
				}
				bp.parallax.lastScroll = bp.parallax.st() <= 0 ? 0 : bp.parallax.st();
			});

			const _titleIntro = new bp.parallax.scroller({
				init: function(scroller) {
					scroller.el.target = document.querySelector('.section-title-intro');
					scroller.el.sc = scroller.el.target.querySelector('.com_section-content');
					scroller.el.cover = scroller.el.target.querySelector('.com_cover-content');

					bp.resizeFn(function() {
						scroller.offset.top = $(scroller.el.sc).offset().top - bp.height();
						scroller.offset.bottom = $(scroller.el.sc).offset().top;
					});

					// console.log('init', scroller);
				},
				update: function(scroller, e) {
					TweenMax.set(scroller.el.sc , {opacity: scroller.offsetPortion(0.6,0.85) });
					TweenMax.set(scroller.el.cover, {opacity: 1 - scroller.offset.current});
					console.log('update', scroller.offset.current );
				}
			});

			new bp.parallax.scroller({
				init: function(scroller) {
					scroller.el.target = _titleIntro.el.sc;
					scroller.el.list = scroller.el.target.querySelectorAll('.se-ti-in-list li');

					scroller.currentList = 0;

					bp.resizeFn(function() {
						scroller.offset.top = $(scroller.el.target).offset().top;
						scroller.offset.bottom = $(scroller.el.target).offset().top + scroller.el.target.offsetHeight;
					});
				},
				update: function(scroller, e) {
					let _currentList = 0;

					$(scroller.el.list).each(function(index) {
						const _this = this;
						const _offset = bp.parallax.st() - ($(_this).offset().top - $(scroller.el.target).offset().top) - (bp.height() * 0.5) + (_this.offsetHeight * 0.25);

						if(_offset >= 0) _currentList = index;

						if(index != scroller.currentList) $(scroller.el.target).removeClass('text-' + index);
					});

					if(_currentList != scroller.currentList) { scroller.currentList = _currentList; }
					$(scroller.el.target).addClass('text-' + scroller.currentList);
				}
			});
		},
		scroller: function(opt) {
			const _scroller = this;

			_scroller.el = {};

			_scroller.offset = {
				top: 0,
				bottom: 0,
				current: 0,
				absolute: true
			};

			_scroller.init = function() {
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
				_scroller.offset.current = (bp.parallax.st() - _scroller.offset.top) / _scroller.offset.bottom - _scroller.offset.top;

				if(_scroller.offset.absolute) {
					if(_scroller.offset.current <= 0) _scroller.offset.current = 0;
					if(_scroller.offset.current >= 1) _scroller.offset.current = 1;
				}
			}

			_scroller.offsetPortion = function(min,max) {
				let _portion = (_scroller.offset.current - min) / (max - min);

				if(_scroller.offset.absolute) {
					if(_portion <= 0) _portion = 0;
					if(_portion >= 1) _portion = 1;
				}

				return _portion
			}

			_scroller.init();
		}
	}
}
bp.init();