// blog-script.js - For files in subdirectories

document.addEventListener('DOMContentLoaded', function() {

    // Function to load HTML partials
    function loadHTML(url, elementId, callback) {
        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (callback) {
                callback();
            }
        })
        .catch(error => console.error(`Error loading ${url}:`, error));
    }

    // Load header and footer with correct paths for subdirectory
    loadHTML('../partials/header.html', 'navbar-placeholder', function() {
        initNavbarToggle();
        highlightActiveNavItem();
        initNavLinksClick();
    });
    loadHTML('../partials/footer.html', 'footer-placeholder');

    // Mobile menu toggle
    function initNavbarToggle() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav-menu');
        if (navToggle) {
            navToggle.addEventListener('click', function() {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }

    // Close menu when clicking a link
    function initNavLinksClick() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                const navToggle = document.getElementById('navToggle');
                const navMenu = document.querySelector('.nav-menu');
                if (navToggle && navMenu) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // Highlight active nav item
    function highlightActiveNavItem() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            // Check if we're on the blog page
            if (linkHref === '../blog.html') {
                link.classList.add('active');
            }
        });
    }
});
