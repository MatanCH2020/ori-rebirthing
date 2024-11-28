// Intersection Observer for fade-in animations
const fadeElements = document.querySelectorAll('.fade-in');
const fadeOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, fadeOptions);

fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(element);
});

// הגדרת ה-URL של Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzwWNnFmrQcKM5O2vSnGdnyHSlr7p7vrf2h_DnU3HVqoKkq1Tg7rnLRnma1ytw7mLj3ew/exec';

// טיפול בשליחת הטופס
const form = document.getElementById('contactForm');
const iframe = document.getElementById('hidden_iframe');

if (form && iframe) {
    // טיפול בתגובה מהשרת
    iframe.addEventListener('load', function() {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton.disabled) {  // רק אם הכפתור מושבת (כלומר, הטופס נשלח)
            // שליחת הודעת WhatsApp
            const formData = {
                name: form.querySelector('#name').value.trim(),
                phone: form.querySelector('#phone').value.trim(),
                email: form.querySelector('#email').value.trim(),
                message: form.querySelector('#message').value.trim()
            };

            const phone = '972547919977';
            const message = `שם: ${formData.name}%0Aטלפון: ${formData.phone}%0Aאימייל: ${formData.email}%0Aהודעה: ${formData.message}`;
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');

            // הצגת הודעת הצלחה
            alert('תודה על פנייתך! ניצור איתך קשר בהקדם.');
            
            // איפוס הטופס והכפתור
            form.reset();
            submitButton.textContent = 'שליחה';
            submitButton.disabled = false;
        }
    });

    // טיפול בשליחת הטופס
    form.addEventListener('submit', function() {
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = 'שולח...';
        submitButton.disabled = true;
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
