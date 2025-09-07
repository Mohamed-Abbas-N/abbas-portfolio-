    const carousel = document.getElementById("carouselSlides");
    const dotsContainer = document.getElementById("carouselDots");

    let currentIndex = 0;
    let isTransitioning = false;
    let autoSlide;
    let resizeTimeout;

    const slides = [...carousel.children];
    const totalRealSlides = slides.length;

    // =======================
    // Initialize carousel
    // =======================
    function initializeCarousel() {
        // Clear any existing clones
        document.querySelectorAll('.clone').forEach(el => el.remove());
        
        // Add new clones based on current viewport
        const slidesPerView = getSlidesPerView();
        const clonesBefore = slides.slice(-slidesPerView).map(slide => {
            const clone = slide.cloneNode(true);
            clone.classList.add("clone");
            return clone;
        });
        const clonesAfter = slides.slice(0, slidesPerView).map(slide => {
            const clone = slide.cloneNode(true);
            clone.classList.add("clone");
            return clone;
        });

        clonesBefore.forEach(clone => carousel.insertBefore(clone, carousel.firstChild));
        clonesAfter.forEach(clone => carousel.appendChild(clone));

        // Reset to first real slide
        currentIndex = slidesPerView;
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(-${currentIndex * getSlideWidth()}%)`;
        
        // Update dots
        updateDots();
    }

    function getSlidesPerView() {
        if (window.innerWidth >= 1024) return 3; // Desktop
        if (window.innerWidth >= 640) return 2; // Tablet
        return 1; // Mobile
    }

    function getSlideWidth() {
        return 100 / getSlidesPerView();
    }

    // =======================
    // Dots
    // =======================
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalRealSlides; i++) {
            const dot = document.createElement("div");
            dot.className = "w-2 h-2 rounded-full bg-gray-500 cursor-pointer transition";
            dot.setAttribute("data-index", i);
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll("div");
        const realIndex = getRealIndex();
        
        dots.forEach((dot, i) => {
            dot.classList.toggle("bg-cyan-700", i === realIndex);
            dot.classList.toggle("bg-gray-500", i !== realIndex);
        });
    }

    function getRealIndex() {
        const slidesPerView = getSlidesPerView();
        let realIndex = (currentIndex - slidesPerView) % totalRealSlides;
        if (realIndex < 0) realIndex += totalRealSlides;
        return realIndex;
    }

    // =======================
    // Slide Functions
    // =======================
    function goToSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        carousel.style.transition = "transform 0.5s ease-in-out";
        currentIndex = index;
        carousel.style.transform = `translateX(-${index * getSlideWidth()}%)`;
        updateDots();
    }

    carousel.addEventListener("transitionend", () => {
        isTransitioning = false;
        const slidesPerView = getSlidesPerView();
        const totalSlides = carousel.children.length;

        if (currentIndex >= totalSlides - slidesPerView) {
            carousel.style.transition = "none";
            currentIndex = slidesPerView;
            carousel.style.transform = `translateX(-${currentIndex * getSlideWidth()}%)`;
        }

        if (currentIndex < slidesPerView) {
            carousel.style.transition = "none";
            currentIndex = totalSlides - 2 * slidesPerView;
            carousel.style.transform = `translateX(-${currentIndex * getSlideWidth()}%)`;
        }

        updateDots();
    });

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // =======================
    // Auto Slide
    // =======================
    function startAutoSlide() {
        clearInterval(autoSlide);
        autoSlide = setInterval(() => {
            nextSlide();
        }, 1500);
    }

    function resetAutoSlide() {
        clearInterval(autoSlide);
        startAutoSlide();
    }

    // =======================
    // Event Listeners
    // =======================
    document.getElementById("nextBtn").addEventListener("click", () => {
        nextSlide();
        resetAutoSlide();
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
        prevSlide();
        resetAutoSlide();
    });

    dotsContainer.addEventListener("click", (e) => {
        if (e.target.getAttribute("data-index")) {
            const index = parseInt(e.target.getAttribute("data-index"));
            const slidesPerView = getSlidesPerView();
            goToSlide(index + slidesPerView);
            resetAutoSlide();
        }
    });

    // =======================
    // Swipe Support (mobile)
    // =======================
    let startX = 0;
    carousel.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        resetAutoSlide();
    });
    
    carousel.addEventListener("touchend", (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
            resetAutoSlide();
        }
    });

    // =======================
    // Lightbox
    // =======================
    const lightbox = document.getElementById("lightboxOverlay");
    const lightboxImg = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");

    let currentLightboxIndex = 0;

    // Select only real slides (ignore clones)
    const realSlides = Array.from(document.querySelectorAll("#carouselSlides > div:not(.clone) img"));

    // Open Lightbox
    realSlides.forEach((img, index) => {
        img.addEventListener("click", () => {
            currentLightboxIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        lightboxImg.src = realSlides[currentLightboxIndex].src;
        lightbox.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.classList.add("hidden");
        document.body.style.overflow = "";
    }

    function showPrevLightbox() {
        currentLightboxIndex = (currentLightboxIndex - 1 + realSlides.length) % realSlides.length;
        lightboxImg.src = realSlides[currentLightboxIndex].src;
    }

    function showNextLightbox() {
        currentLightboxIndex = (currentLightboxIndex + 1) % realSlides.length;
        lightboxImg.src = realSlides[currentLightboxIndex].src;
    }

    // Lightbox Events
    lightboxClose.addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", showPrevLightbox);
    lightboxNext.addEventListener("click", showNextLightbox);

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
        if (lightbox.classList.contains("hidden")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") showPrevLightbox();
        if (e.key === "ArrowRight") showNextLightbox();
    });

    // =======================
    // Window Resize Handling
    // =======================
    window.addEventListener("resize", () => {
        // Clear any pending resize timeout
        clearTimeout(resizeTimeout);
        
        // Stop auto slide during resize
        clearInterval(autoSlide);
        
        // Use a timeout to debounce the resize event
        resizeTimeout = setTimeout(() => {
            // Reinitialize carousel with new settings
            initializeCarousel();
            
            // Restart auto slide
            startAutoSlide();
        }, 250);
    });

    // =======================
    // Initialize everything
    // =======================
    createDots();
    initializeCarousel();
    startAutoSlide();