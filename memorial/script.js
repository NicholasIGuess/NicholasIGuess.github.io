function adjustParallaxContainerHeight() {
    const parallaxContainer = document.getElementById('parallax-container');
    var contentHeight = parallaxContainer.scrollHeight;
    contentHeight += 10;
    parallaxContainer.style.height = `${contentHeight}px`;
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.onscroll = function() {
    var scrollButton = document.querySelector('.scrollToTopBtn');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollButton.style.display = "block";
    } else {
        scrollButton.style.display = "none";
    }
};

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const sectionId = this.getAttribute('href').substring(1);
        scrollToSection(sectionId);
    });
});

window.addEventListener('resize', adjustParallaxContainerHeight);
window.addEventListener('load', adjustParallaxContainerHeight);