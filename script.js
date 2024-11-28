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

// Form handling
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        let isValid = true;
        const errors = [];

        if (!data.name || data.name.trim().length < 2) {
            isValid = false;
            errors.push('נא להזין שם מלא');
        }

        if (!data.phone || !/^[\d-+\s()]{9,}$/.test(data.phone)) {
            isValid = false;
            errors.push('נא להזין מספר טלפון תקין');
        }

        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            isValid = false;
            errors.push('נא להזין כתובת אימייל תקינה');
        }

        if (!data.message || data.message.trim().length < 10) {
            isValid = false;
            errors.push('נא להזין הודעה של לפחות 10 תווים');
        }

        // Clear previous error messages
        const existingErrors = form.querySelector('.form-errors');
        if (existingErrors) {
            existingErrors.remove();
        }

        if (!isValid) {
            // Display errors
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-errors';
            errorDiv.style.color = '#E53E3E';
            errorDiv.style.marginBottom = '1rem';
            errorDiv.style.textAlign = 'right';
            errorDiv.innerHTML = errors.map(error => `<p>* ${error}</p>`).join('');
            form.insertBefore(errorDiv, form.firstChild);
            return;
        }

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = '...שולח';

        try {
            // Here you would typically send the data to your server
            // For now, we'll simulate a server delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            form.innerHTML = `
                <div class="success-message" style="text-align: center; color: #38A169;">
                    <h3 style="color: #38A169; margin-bottom: 1rem;">!תודה על פנייתך</h3>
                    <p>אצור איתך קשר בהקדם</p>
                </div>
            `;
        } catch (error) {
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-errors';
            errorDiv.style.color = '#E53E3E';
            errorDiv.style.marginBottom = '1rem';
            errorDiv.style.textAlign = 'right';
            errorDiv.innerHTML = '<p>* אירעה שגיאה בשליחת הטופס. נא לנסות שוב מאוחר יותר.</p>';
            form.insertBefore(errorDiv, form.firstChild);

            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// WhatsApp form submission functionality
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Create formatted WhatsApp message
    const whatsappMessage = `*פנייה חדשה מדף הנחיתה*%0A%0A` +
        `*שם:* ${name}%0A` +
        `*טלפון:* ${phone}%0A` +
        `*אימייל:* ${email}%0A` +
        `*הודעה:* ${message}`;
    
    // מספר הטלפון המעודכן שלך
    const phoneNumber = '972524517021';
    
    // יצירת הקישור לוואטסאפ
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${whatsappMessage}`;
    
    // Display confirmation message
    alert('תודה על פנייתך! מעביר אותך לוואטסאפ...');
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    this.reset();
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

function handleSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // Basic validation
    if (!validateForm(formData)) {
        return false;
    }

    // Display loading message
    const submitButton = document.querySelector('.cta-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = '...שולח';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual server-side code)
    setTimeout(() => {
        // Display success message
        showSuccessMessage();
        
        // Reset form and button
        document.getElementById('contactForm').reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
    
    return false;
}

function validateForm(formData) {
    // Name validation
    if (formData.name.length < 2) {
        showError('אנא הזן שם תקין');
        return false;
    }

    // Phone validation
    const phoneRegex = /^0[2-9]\d{7,8}$/;
    if (!phoneRegex.test(formData.phone)) {
        showError('אנא הזן מספר טלפון תקין');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showError('אנא הזן כתובת אימייל תקינה');
        return false;
    }

    return true;
}

function showError(message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background-color: #FFE9E9;
        color: #D63031;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 15px;
        text-align: center;
    `;
    errorDiv.textContent = message;

    // Add error message to form
    const form = document.getElementById('contactForm');
    form.insertBefore(errorDiv, form.firstChild);

    // Remove error message after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function showSuccessMessage() {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background-color: #D4EDDA;
        color: #155724;
        padding: 15px;
        border-radius: 5px;
        margin: 20px 0;
        text-align: center;
        font-size: 1.1em;
    `;
    successDiv.textContent = 'תודה רבה! פרטיך נקלטו בהצלחה, ניצור איתך קשר בהקדם.';

    // Add success message after form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(successDiv, form.nextSibling);

    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}
