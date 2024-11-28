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
async function submitForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    submitButton.textContent = 'שולח...';
    submitButton.disabled = true;

    try {
        const formData = {
            name: form.querySelector('#name').value.trim(),
            phone: form.querySelector('#phone').value.trim(),
            email: form.querySelector('#email').value.trim(),
            message: form.querySelector('#message').value.trim()
        };

        // בדיקת תקינות
        if (!formData.name || formData.name.length < 2) {
            throw new Error('נא להזין שם מלא');
        }
        if (!formData.phone || !/^[\d-+\s()]{9,}$/.test(formData.phone)) {
            throw new Error('נא להזין מספר טלפון תקין');
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            throw new Error('נא להזין כתובת אימייל תקינה');
        }
        if (!formData.message || formData.message.length < 5) {
            throw new Error('נא להזין הודעה');
        }

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'success') {
            // שליחת הודעת WhatsApp
            const phone = '972547919977';
            const message = `שם: ${formData.name}%0Aטלפון: ${formData.phone}%0Aאימייל: ${formData.email}%0Aהודעה: ${formData.message}`;
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
            
            // הצגת הודעת הצלחה
            alert('תודה על פנייתך! ניצור איתך קשר בהקדם.');
            form.reset();
        } else {
            throw new Error(result.message || 'שגיאה בשליחת הטופס');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'אירעה שגיאה בשליחת הטופס. אנא נסה שוב מאוחר יותר.');
    } finally {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
}

// הוספת מאזין לטופס
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', submitForm);
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
