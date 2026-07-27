document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons dynamically
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /*Loading Screen Transition*/
    const loader = document.getElementById("loader");
    if (loader) {
        window.addEventListener("load", () => {
            loader.classList.add("opacity-0");
            setTimeout(() => {
                loader.style.display = "none";
            }, 500);
        });
        // Safety timeout if window load event doesn't fire promptly
        setTimeout(() => {
            loader.classList.add("opacity-0");
            setTimeout(() => { loader.style.display = "none"; }, 500);
        }, 2500);
    }

    /*Scroll Progress & Sticky Navigation Bar Status*/
    const navbar = document.getElementById("navbar");
    const navLogoText = document.getElementById("nav-logo-text");
    const menuToggle = document.getElementById("menu-toggle");
    const scrollProgress = document.getElementById("scroll-progress");
    const backToTopBtn = document.getElementById("back-to-top");

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;

        // Progress Indicator
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + "%";
        }

        // Navigation state transition (transparent -> glassmorphism darkPurple background)
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add("bg-darkPurple/90", "backdrop-blur-md", "py-4", "shadow-lg", "border-b", "border-white/5");
                navbar.classList.remove("py-6");
            } else {
                navbar.classList.remove("bg-darkPurple/90", "backdrop-blur-md", "py-4", "shadow-lg", "border-b", "border-white/5");
                navbar.classList.add("py-6");
            }
        }

        // Back To Top Button state visibility toggle
        if (backToTopBtn) {
            if (scrollTop > 400) {
                backToTopBtn.classList.remove("opacity-0", "pointer-events-none");
                backToTopBtn.classList.add("opacity-100", "pointer-events-auto");
            } else {
                backToTopBtn.classList.add("opacity-0", "pointer-events-none");
                backToTopBtn.classList.remove("opacity-100", "pointer-events-auto");
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /*Mobile Hamburger Menu Toggle Action*/
    const mobileMenu = document.getElementById("mobile-menu");
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
            mobileMenu.classList.toggle("flex");
            
            const icon = menuToggle.querySelector("i");
            if (icon) {
                const currentName = icon.getAttribute("data-lucide");
                const newName = currentName === "menu" ? "x" : "menu";
                icon.setAttribute("data-lucide", newName);
                lucide.createIcons();
            }
        });

        // Close menu on selecting item
        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.add("hidden");
                mobileMenu.classList.remove("flex");
                const icon = menuToggle.querySelector("i");
                if (icon) {
                    icon.setAttribute("data-lucide", "menu");
                    lucide.createIcons();
                }
            });
        });
    }

    /*Unified Smooth Scroll Animation (IntersectionObserver API)*/
    const reveals = document.querySelectorAll(".scroll-reveal");
    if (reveals.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target); // Trigger once
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        reveals.forEach(el => revealObserver.observe(el));
    }

    /*Automated Slide Carousel (Homepage Service Section)*/
    const carouselTrack = document.getElementById("carousel-track");
    const prevBtn = document.getElementById("prev-slide");
    const nextBtn = document.getElementById("next-slide");
    const dotsContainer = document.getElementById("carousel-dots");

    if (carouselTrack) {
        const slides = Array.from(carouselTrack.children);
        const dots = dotsContainer ? Array.from(dotsContainer.children) : [];
        let currentIdx = 0;
        let autoSlideInterval;

        const updateCarousel = (index) => {
            currentIdx = index;
            // Bound index safety validation
            if (currentIdx < 0) currentIdx = slides.length - 1;
            if (currentIdx >= slides.length) currentIdx = 0;

            // Shift dynamic track
            carouselTrack.style.transform = `translateX(-${currentIdx * 100}%)`;

            // Active dot indicators transition
            dots.forEach((dot, dIdx) => {
                if (dIdx === currentIdx) {
                    dot.classList.add("bg-primary", "w-6");
                    dot.classList.remove("bg-white/20");
                } else {
                    dot.classList.remove("bg-primary", "w-6");
                    dot.classList.add("bg-white/20");
                }
            });
        };

        const nextSlide = () => updateCarousel(currentIdx + 1);
        const prevSlide = () => updateCarousel(currentIdx - 1);

        if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); resetTimer(); });
        if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); resetTimer(); });

        if (dots.length > 0) {
            dots.forEach(dot => {
                dot.addEventListener("click", (e) => {
                    const index = parseInt(e.target.getAttribute("data-slide"), 10);
                    updateCarousel(index);
                    resetTimer();
                });
            });
        }

        const startTimer = () => {
            autoSlideInterval = setInterval(nextSlide, 5000); // Transitions exact every 5 seconds
        };

        const resetTimer = () => {
            clearInterval(autoSlideInterval);
            startTimer();
        };

        // Initialize Carousel
        updateCarousel(0);
        startTimer();
    }

    /*Prayer Request Form Submission Success States*/
    const prayerForm = document.getElementById("prayer-form");
    const formSuccessState = document.getElementById("form-success");
    const resetFormBtn = document.getElementById("reset-form");

    if (prayerForm && formSuccessState) {
        prayerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            // Optional: Process field values safely here for future API connections
            
            // Render glass container success overlay smoothly
            formSuccessState.classList.remove("hidden");
            formSuccessState.classList.add("flex");
        });
    }

    if (resetFormBtn && prayerForm && formSuccessState) {
        resetFormBtn.addEventListener("click", () => {
            prayerForm.reset();
            formSuccessState.classList.add("hidden");
            formSuccessState.classList.remove("flex");
        });
    }

    const faqToggles = document.querySelectorAll(".faq-toggle");
    faqToggles.forEach(btn => {
        btn.addEventListener("click", () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector("i");
            
            if (content.style.maxHeight && content.style.maxHeight !== "0px") {
                content.style.maxHeight = "0px";
                if (icon) {
                    icon.setAttribute("data-lucide", "plus");
                }
            } else {
                document.querySelectorAll(".faq-content").forEach(c => c.style.maxHeight = "0px");
                document.querySelectorAll(".faq-toggle i").forEach(i => {
                    i.setAttribute("data-lucide", "plus");
                });
                
                content.style.maxHeight = content.scrollHeight + "px";
                if (icon) {
                    icon.setAttribute("data-lucide", "minus");
                }
            }
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });

});