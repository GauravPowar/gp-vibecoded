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
});