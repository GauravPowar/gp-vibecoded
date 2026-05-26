document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize Theme BEFORE loading content to prevent flash
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Function to load HTML partials
    function loadHTML(url, elementId, callback) {
        fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (callback) callback();
        })
        .catch(error => console.error(`Error loading ${url}:`, error));
    }

    // Load Header & Footer
    loadHTML('partials/header.html', 'navbar-placeholder', function() {
        initNavbar();
        initThemeToggle();
        highlightActiveNavItem();
    });
    loadHTML('partials/footer.html', 'footer-placeholder');

    function initNavbar() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav-menu');
        if (navToggle) {
            navToggle.addEventListener('click', function() {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }

    function initThemeToggle() {
        const toggleBtn = document.getElementById('themeToggleBtn');
        const icon = toggleBtn.querySelector('i');
        
        // Set initial icon based on current theme
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }

        toggleBtn.addEventListener('click', function() {
            let targetTheme = 'light';
            // Switch logic
            if (document.documentElement.getAttribute('data-theme') === 'light') {
                targetTheme = 'dark';
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                targetTheme = 'light';
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
            
            // Apply & Save
            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('theme', targetTheme);
        });
    }

    function highlightActiveNavItem() {
        const path = window.location.pathname;
        let currentPage = path.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================================================
    // Custom Cursor Setup (Premium Desktop Only)
    // ==========================================================================
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const dot = document.createElement('div');
        const outline = document.createElement('div');
        dot.className = 'custom-cursor-dot';
        outline.className = 'custom-cursor-outline';
        document.body.appendChild(dot);
        document.body.appendChild(outline);

        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;
        const speed = 0.15; // Smooth trailing speed factor

        window.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        });

        function animateOutline() {
            outlineX += (mouseX - outlineX) * speed;
            outlineY += (mouseY - outlineY) * speed;
            outline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0)`;
            requestAnimationFrame(animateOutline);
        }
        animateOutline();

        // Event delegation for dynamic hover bindings (supports AJAX/fetched partials)
        window.addEventListener('mouseover', function(e) {
            if (e.target.closest('a, button, .btn, .pill, .timeline-item, .card, .control-dot')) {
                dot.classList.add('hovering');
                outline.classList.add('hovering');
            }
        });

        window.addEventListener('mouseout', function(e) {
            const interactive = e.target.closest('a, button, .btn, .pill, .timeline-item, .card, .control-dot');
            if (interactive) {
                const related = e.relatedTarget;
                if (!related || !related.closest('a, button, .btn, .pill, .timeline-item, .card, .control-dot')) {
                    dot.classList.remove('hovering');
                    outline.classList.remove('hovering');
                }
            }
        });
    }
});