// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('.header');
const appointmentForm = document.getElementById('appointment-form');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in animation to sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
});

// Testimonials Slider
const testimonialsTrack = document.querySelector('.testimonials-track');
const testimonials = document.querySelectorAll('.testimonial');
const prevButton = document.querySelector('.testimonial-nav.prev');
const nextButton = document.querySelector('.testimonial-nav.next');

let currentPosition = 0;
let slideWidth = 0;
let slidesPerView = 3;

function updateSlideWidth() {
    const containerWidth = testimonialsTrack.parentElement.offsetWidth;
    const gap = 32; // 2rem gap
    slideWidth = (containerWidth - (gap * (slidesPerView - 1))) / slidesPerView;
    
    testimonials.forEach(testimonial => {
        testimonial.style.width = `${slideWidth}px`;
    });
}

function updateSlidesPerView() {
    if (window.innerWidth <= 768) {
        slidesPerView = 1;
    } else if (window.innerWidth <= 1024) {
        slidesPerView = 2;
    } else {
        slidesPerView = 3;
    }
    updateSlideWidth();
}

function moveSlides(direction) {
    const maxPosition = -(testimonials.length - slidesPerView) * slideWidth;
    
    if (direction === 'next' && currentPosition > maxPosition) {
        currentPosition -= slideWidth;
    } else if (direction === 'prev' && currentPosition < 0) {
        currentPosition += slideWidth;
    }
    
    testimonialsTrack.style.transform = `translateX(${currentPosition}px)`;
    
    // Update button states
    prevButton.style.opacity = currentPosition < 0 ? '1' : '0.5';
    nextButton.style.opacity = currentPosition > maxPosition ? '0.5' : '1';
}

// Initialize
updateSlidesPerView();
window.addEventListener('resize', updateSlidesPerView);

// Event listeners
prevButton.addEventListener('click', () => moveSlides('prev'));
nextButton.addEventListener('click', () => moveSlides('next'));

// Auto slide
let autoSlideInterval = setInterval(() => moveSlides('next'), 5000);

// Pause auto slide on hover
testimonialsTrack.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

testimonialsTrack.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(() => moveSlides('next'), 5000);
});

// Form Validation and Submission
appointmentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    let isValid = true;
    const requiredFields = ['name', 'phone', 'email', 'service', 'datetime'];
    
    requiredFields.forEach(field => {
        if (!data[field]) {
            isValid = false;
            const input = this.querySelector(`[name="${field}"]`);
            input.classList.add('error');
        } else {
            const input = this.querySelector(`[name="${field}"]`);
            input.classList.remove('error');
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        isValid = false;
        this.querySelector('[name="email"]').classList.add('error');
    }
    
    // Phone validation
    if (data.phone && !isValidPhone(data.phone)) {
        isValid = false;
        this.querySelector('[name="phone"]').classList.add('error');
    }
    
    if (isValid) {
        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        showNotification('Qeydiyyatınız uğurla tamamlandı! Tezliklə sizinlə əlaqə saxlayacağıq.', 'success');
        this.reset();
    } else {
        showNotification('Zəhmət olmasa bütün məlumatları düzgün doldurun.', 'error');
    }
});

// Helper Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\+?[0-9]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger reflow
    notification.offsetHeight;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification.success {
        background-color: #4CAF50;
    }
    
    .notification.error {
        background-color: #f44336;
    }
    
    .fade-in-section {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .fade-in-section.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .error {
        border-color: #f44336 !important;
    }
`;
document.head.appendChild(style);

// Portfolio Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            phone: document.getElementById('contact-phone').value,
            message: document.getElementById('contact-message').value
        };

        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Göndərilir...';
        submitButton.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Show success message
            showNotification('Mesajınız uğurla göndərildi!', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    });
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add smooth scroll for contact section links
document.querySelectorAll('a[href^="#contact"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add hover effect for clickable info items
document.querySelectorAll('.info-item.clickable').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(10px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// Mouse-following bubble effect
const contactSection = document.querySelector('.contact');
const followBubble = document.querySelector('.bubble-follow');

if (contactSection && followBubble) {
    contactSection.addEventListener('mousemove', (e) => {
        const rect = contactSection.getBoundingClientRect();
        const x = e.clientX - rect.left - followBubble.offsetWidth / 2;
        const y = e.clientY - rect.top - followBubble.offsetHeight / 2;
        
        // Add some lag to the movement
        const currentX = parseFloat(followBubble.style.transform.replace(/[^\d.-]/g, '')) || 0;
        const currentY = parseFloat(followBubble.style.transform.split(',')[1]?.replace(/[^\d.-]/g, '')) || 0;
        
        const newX = currentX + (x - currentX) * 0.1;
        const newY = currentY + (y - currentY) * 0.1;
        
        followBubble.style.transform = `translate(${newX}px, ${newY}px)`;
    });
} 