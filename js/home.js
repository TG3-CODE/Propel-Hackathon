document.addEventListener('DOMContentLoaded', function() {
    // Set up navigation for Join Now buttons
    const joinButtons = document.querySelectorAll('.join-btn');
    
    joinButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
        });
    });
    
    // Hamburger menu toggle functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside of it
        document.addEventListener('click', function(event) {
            if (!hamburgerMenu.contains(event.target) && hamburgerMenu.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
            }
        });
        
        // Set up navigation for menu items
        const menuItems = document.querySelectorAll('.menu-dropdown a');
        
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href) {
                    window.location.href = href;
                }
            });
        });
    }
});
