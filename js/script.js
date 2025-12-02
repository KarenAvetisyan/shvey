document.addEventListener('DOMContentLoaded', function(){
        /*Easy selector helper function */
        const select = (el, all = false) => {
                if (!el || typeof el !== 'string') return null;
                el = el.trim();
                if (all) {
                        return [...document.querySelectorAll(el)];
                } else {
                        return document.querySelector(el);
                }
        }
        /* Easy event listener function */
        const on = (type, el, listener, all = false) => {
                let selectEl = select(el, all)
                if (selectEl) {
                if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener))
                } else {
                selectEl.addEventListener(type, listener)
                }
                }
        }
        /* Easy on scroll event listener  */
        const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
        }
        
        // хедер при при скролле 
        let selectHeader = select('.header')
        if (selectHeader) {
        const headerScrolled = () => {
        if (window.scrollY > 100) {
                selectHeader.classList.add('scrolling')
        } else {
                selectHeader.classList.remove('scrolling')
        }
        }
        window.addEventListener('load', headerScrolled)
        onscroll(window, headerScrolled)
        }

        // бургер
        on('click', '.js-burger', function(e){
                select('.header-collapse').classList.toggle('show');
                select('.nav__overlay').classList.toggle('show');
        })
        on('click', '.js-burger-close, .nav__overlay',  function(e){
                e.preventDefault();
                select('.header-collapse').classList.remove('show');
                select('.nav__overlay').classList.remove('show');
        }, true)

        // меню для адаптивного 
        const toggles = document.querySelectorAll('.js-toggle-inner-nav');
        if (window.innerWidth < 1199) {
        toggles.forEach(toggle => {
                toggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const currentMenu = this.parentElement.querySelector(':scope > .js-inner-nav');
                if (!currentMenu) return;
                const siblingMenus = this.parentElement.parentElement.querySelectorAll(':scope > li > .js-inner-nav.show');
                siblingMenus.forEach(menu => {
                        if (menu !== currentMenu) {
                        menu.classList.remove('show');
                        const siblingToggle = menu.parentElement.querySelector(':scope > .js-toggle-inner-nav');
                        if (siblingToggle) {
                                siblingToggle.classList.remove('_active');
                        }
                        }
                });

                currentMenu.classList.toggle('show');
                this.classList.toggle('_active');
                });
        });
        }

        // якоря
        document.body.addEventListener('click', function(e) {
        if (!e.target.matches('.js-scrollTo')) return;
        let href = e.target.getAttribute('href');
        if (!href) return;
        if (href.startsWith('/')) href = href.slice(1);
        if (href.startsWith('#')) {
                const targetElement = select(href);
                if (!targetElement) return;

                e.preventDefault();

                const duration = 800; // Faster scroll (800ms)
                const start = window.scrollY;
                let startTime = null;

                function easeInOutQuad(t) {
                return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;
                }

                function step(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeInOutQuad(progress);

                // Recalculate target position dynamically
                const targetY = targetElement.getBoundingClientRect().top + window.scrollY;
                const scrollTo = start + (targetY - start) * easedProgress;

                window.scrollTo(0, scrollTo);

                if (progress < 1) {
                        requestAnimationFrame(step);
                }
                }

                requestAnimationFrame(step);
        }
        }, true);

        // Переключатель 
        document.addEventListener('click', function (e) {
        const btn = e.target.closest('.js-togglerBtn');
        if (!btn) return;
        const textEl = btn.querySelector('span') || btn;

        if (!btn.dataset._originalText) {
                btn.dataset._originalText = textEl.textContent.trim();
        }
        const targetId = btn.dataset.target;
        if (!targetId) return;

        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        const toggledText = btn.dataset.toggledText || "Скрыть";
        const defaultText = btn.dataset._originalText;

        targetEl.classList.toggle("_toggled");

        textEl.textContent = targetEl.classList.contains("_toggled")
                ? toggledText
                : defaultText;
        });

        // таблицы для моб. 
        const tables = document.querySelectorAll(".js-table-modify-mobile");
        const mq = window.matchMedia("(max-width: 991px)");
        mq.addEventListener("change", handleScreen);
        handleScreen(mq); 
        function handleScreen(e) {
                if (e.matches) {
                        makeMobileTables();
                } else {
                        resetTables();
                }
        }
        function makeMobileTables() {
        tables.forEach(table => {
                const ths = [...table.querySelectorAll("thead th")].map(th => th.innerText.trim());
                const rows = table.querySelectorAll("tbody tr");

                rows.forEach(row => {
                // prevent duplicates
                if (row.querySelector(".mobile-title")) return;

                const tds = row.querySelectorAll("td");

                tds.forEach((td, index) => {
                        const label = ths[index] || "";
                        const newTd = document.createElement("td");
                        newTd.classList.add("mobile-title");
                        newTd.innerText = label;
                        row.insertBefore(newTd, td);
                });
                });
        });
        }
        function resetTables() {
        tables.forEach(table => {
                table.querySelectorAll(".mobile-title").forEach(el => el.remove());
        });
        }

        // dynamic swiper appear 
        function loadSwiperScript() {
                return new Promise((resolve) => {
                        const existingScript = document.querySelector(
                        'script[src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"]'
                        );

                        if (existingScript) {
                        resolve();
                        return;
                        }

                        const swiperScript = document.createElement('script');
                        swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
                        swiperScript.async = true;

                        swiperScript.onload = () => resolve();
                        document.body.appendChild(swiperScript);
                });
        }
        const swiperObserverCallback = (entries) => {
        entries.forEach(entry => {
                if (entry.isIntersecting) {

                loadSwiperScript().then(() => {
                        const _swipers = document.querySelectorAll('._swiper');
                        _swipers.forEach(_swiper => {
                                const loop = _swiper.dataset.loop === "true";
                                const effect = _swiper.dataset.effect || 'slide'; // Default to 'slide'
                                const autoHeight = _swiper.dataset.autoHeight === "true";
                                const speed = _swiper.dataset.speed ? _swiper.dataset.speed : false;
                                const nextEl = _swiper.dataset.nextEl ? _swiper.dataset.nextEl : false;
                                const prevEl = _swiper.dataset.prevEl ? _swiper.dataset.prevEl : false;
                                const slidesPerView = _swiper.dataset.slidesPerView;
                                const spaceBetween = parseInt(_swiper.dataset.spaceBetween) || 10;
                                const autoplay = _swiper.dataset.autoplay === "true";
                                const pagination = _swiper.dataset.pagination === "true";
                                const navigation = _swiper.dataset.navigation === "true";
                                const breakpoints = _swiper.dataset.breakpoints ? JSON.parse(_swiper.dataset.breakpoints) : {};
                                
                                new Swiper(_swiper, {
                                        loop: loop,
                                        autoHeight: autoHeight,
                                        effect: effect,
                                        speed: speed ? speed : 300,
                                        slidesPerView: slidesPerView ? slidesPerView : 'auto', 
                                        spaceBetween: spaceBetween,
                                        
                                        autoplay: autoplay ? {
                                                delay: 2500,
                                                disableOnInteraction: false
                                        } : false,
                                        pagination: pagination ? {
                                                el: _swiper.querySelector('.swiper-pagination'),
                                                clickable: true
                                        } : false,
                                        navigation: navigation ? {
                                                nextEl: nextEl ? document.querySelector(`.${nextEl}`) : _swiper.querySelector('.arrow--item.ar__right'),
                                                prevEl: prevEl ? document.querySelector(`.${prevEl}`) : _swiper.querySelector('.arrow--item.ar__left')
                                        } : false,
                                        breakpoints: {
                                                ...breakpoints, 
                                                },
                                });
                        })
                });

                swiperObserver.disconnect();
                }
        });
        };
        const swiperObserver = new IntersectionObserver(swiperObserverCallback, {
        rootMargin: '300px 0px', 
        });

        document.querySelectorAll('.swiper').forEach(el => {
        swiperObserver.observe(el);
        });

        // observer
        const inViewport = (entries, observer) => {
        entries.forEach(entry => {
                const el = entry.target;

                el.classList.toggle("is-inViewport", entry.isIntersecting);

                if (entry.isIntersecting && !el.classList.contains('watched')) {
                let delay = el.getAttribute('data-delay');
                if (window.innerWidth < 992 && delay) {
                        const delayNum = parseFloat(delay) || 0;
                        delay = Math.min(delayNum, 0.2) + 's';
                }

                if (delay) {
                        el.style.transitionDelay = delay;
                        el.style.animationDelay = delay;
                }

                el.classList.add("watched");
                }
        });
        };
        let ioConfiguration = {
        rootMargin: '0% 0% 0% 0%',
        threshold: 0.2
        };
        const Obs = new IntersectionObserver(inViewport, ioConfiguration);
        document.querySelectorAll('[data-inviewport]').forEach(EL => {
        Obs.observe(EL);
        });

})


