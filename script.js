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

// Form Handling
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return; // אם אין טופס, לא ממשיכים

    const formStatus = document.getElementById('formStatus');
    const submitButton = form.querySelector('.submit-button');
    if (!submitButton) return; // אם אין כפתור שליחה, לא ממשיכים

    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoader = submitButton.querySelector('.button-loader');

    const showStatus = (message, type) => {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    };

    const setLoading = (loading) => {
        if (!submitButton || !buttonText || !buttonLoader) return;
        submitButton.disabled = loading;
        buttonText.style.display = loading ? 'none' : 'block';
        buttonLoader.style.display = loading ? 'block' : 'none';
    };

    const validateForm = () => {
        const nameInput = form.querySelector('#name');
        const phoneInput = form.querySelector('#phone');
        const emailInput = form.querySelector('#email');
        const messageInput = form.querySelector('#message');

        if (!nameInput || !phoneInput || !emailInput || !messageInput) {
            throw new Error('חסרים שדות בטופס');
        }

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (name.length < 2) {
            throw new Error('נא להזין שם מלא (לפחות 2 תווים)');
        }
        if (!/^[\d-+\s()]{9,}$/.test(phone)) {
            throw new Error('נא להזין מספר טלפון תקין');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('נא להזין כתובת אימייל תקינה');
        }
        if (message.length < 5) {
            throw new Error('נא להזין הודעה (לפחות 5 תווים)');
        }

        return { name, phone, email, message };
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = validateForm();

            // Send to WhatsApp
            const phone = '972547919977';
            const whatsappMessage = `שם: ${formData.name}%0Aטלפון: ${formData.phone}%0Aאימייל: ${formData.email}%0Aהודעה: ${formData.message}`;
            window.open(`https://wa.me/${phone}?text=${whatsappMessage}`, '_blank');

            // Send to Email (you can add your email service here)
            // For now, we'll just show success message
            showStatus('ההודעה נשלחה בהצלחה! ניצור איתך קשר בהקדם.', 'success');
            form.reset();

        } catch (error) {
            showStatus(error.message, 'error');
        } finally {
            setLoading(false);
        }
    });
});

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
