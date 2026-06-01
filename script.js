document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileClose = document.getElementById('mobile-close');
    const overlay = document.getElementById('overlay');
    const backToTop = document.getElementById('backToTop');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav ul li a');

    // Sticky Navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show/Hide Back to Top button
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active link highlighting
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });

    // Mobile Menu Toggle
    const openMenu = () => {
        mobileNav.classList.add('active');
        overlay.classList.add('active');
    };

    const closeMenu = () => {
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
    };

    if (mobileToggle) mobileToggle.addEventListener('click', openMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Smooth Scrolling for links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                closeMenu();
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to Top functionality
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Scroll Animations (Fade-in effect using Intersection Observer)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });

    // Lightbox Gallery Implementation
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentIndex = 0;
    const imagesList = [];

    // Parse image gallery elements to build metadata cache
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const overlayText = item.querySelector('.gallery-text');
        
        if (img) {
            imagesList.push({
                src: img.getAttribute('src'),
                alt: img.getAttribute('alt') || 'Gallery Image',
                title: overlayText ? overlayText.textContent.trim() : (img.getAttribute('alt') || 'Gallery Image')
            });

            item.addEventListener('click', () => {
                currentIndex = index;
                openLightbox();
            });
        }
    });

    const openLightbox = () => {
        if (!lightbox) return;
        updateLightboxContent();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore background scrolling
    };

    const updateLightboxContent = () => {
        if (imagesList.length === 0) return;
        const currentData = imagesList[currentIndex];
        if (lightboxImg) {
            lightboxImg.setAttribute('src', currentData.src);
            lightboxImg.setAttribute('alt', currentData.alt);
        }
        if (lightboxCaption) {
            lightboxCaption.textContent = currentData.title;
        }
    };

    const showNextImage = (e) => {
        if (e) e.stopPropagation();
        currentIndex = (currentIndex + 1) % imagesList.length;
        updateLightboxContent();
    };

    const showPrevImage = (e) => {
        if (e) e.stopPropagation();
        currentIndex = (currentIndex - 1 + imagesList.length) % imagesList.length;
        updateLightboxContent();
    };

    if (lightboxClose) lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

    // Close lightbox on clicking the blurred background wrapper
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
                closeLightbox();
            }
        });
    }

    // Keyboard controls support
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    });
});
