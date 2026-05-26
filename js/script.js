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

    // ==========================================================================
    // Premium Glassmorphic PDF Modal Viewer logic
    // ==========================================================================
    function openPDFModal(pdfUrl) {
        // Double check: if it's mobile, we fallback to native new-tab opening!
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            window.open(pdfUrl, '_blank');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'pdf-modal';
        modal.innerHTML = `
            <div class="pdf-modal-backdrop"></div>
            <div class="pdf-modal-container">
                <div class="pdf-modal-header">
                    <h3>Curriculum Vitae</h3>
                    <div class="pdf-modal-actions">
                        <a href="${pdfUrl}" class="btn primary-btn" download style="padding: 8px 18px; font-size: 0.85rem;"><i class="fas fa-download"></i> Download PDF</a>
                        <button class="pdf-modal-close" aria-label="Close Preview">&times;</button>
                    </div>
                </div>
                <div class="pdf-modal-body">
                    <iframe src="${pdfUrl}#toolbar=0&navpanes=0" width="100%" height="100%" frameborder="0"></iframe>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden'; // Lock main scroll

        const closeModal = () => {
            modal.classList.add('closing');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = ''; // Unlock main scroll
            }, 300);
        };

        modal.querySelector('.pdf-modal-close').addEventListener('click', closeModal);
        modal.querySelector('.pdf-modal-backdrop').addEventListener('click', closeModal);

        // Escape key closes modal
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                window.removeEventListener('keydown', handleKeyDown);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
    }

    // PDF click delegation (automatically catches any link to CV.pdf on the site)
    window.addEventListener('click', function(e) {
        const resumeLink = e.target.closest('a[href*="docs/CV.pdf"]:not([download])');
        if (resumeLink) {
            e.preventDefault();
            const pdfUrl = resumeLink.getAttribute('href');
            openPDFModal(pdfUrl);
        }
    });
});