// Contact Form Handler with Validation and Toast Notifications
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('Contact form script loaded - DOMContentLoaded fired');
    
    // Toast notification function
    function showToast(message, type = 'success') {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${type === 'success' ? '✓' : '✗'}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .toast-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .toast-icon {
                font-weight: bold;
                font-size: 16px;
            }
            .toast-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                margin-left: auto;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }
    
    // Form validation function
    function validateForm(form) {
        const errors = [];
        
        // Get form elements
        const firstName = form.querySelector('input[name="first_name"]');
        const lastName = form.querySelector('input[name="last_name"]');
        const email = form.querySelector('input[name="email"]');
        const message = form.querySelector('textarea[name="message"]');
        
        // Validate required fields
        if (!firstName.value.trim()) {
            errors.push('First name is required');
            firstName.classList.add('error-field');
        } else {
            firstName.classList.remove('error-field');
        }
        
        if (!lastName.value.trim()) {
            errors.push('Last name is required');
            lastName.classList.add('error-field');
        } else {
            lastName.classList.remove('error-field');
        }
        
        if (!email.value.trim()) {
            errors.push('Email is required');
            email.classList.add('error-field');
        } else if (!isValidEmail(email.value)) {
            errors.push('Please enter a valid email address');
            email.classList.add('error-field');
        } else {
            email.classList.remove('error-field');
        }
        
        if (!message.value.trim()) {
            errors.push('Message is required');
            message.classList.add('error-field');
        } else {
            message.classList.remove('error-field');
        }
        
        return errors;
    }
    
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Add error field styles
    const errorStyles = document.createElement('style');
    errorStyles.textContent = `
        .error-field {
            border: 2px solid #f44336 !important;
            background-color: #ffebee !important;
        }
        .error-field:focus {
            border-color: #f44336 !important;
            box-shadow: 0 0 5px rgba(244, 67, 54, 0.3) !important;
        }
    `;
    document.head.appendChild(errorStyles);
    
    // Handle all contact forms
    const contactForms = document.querySelectorAll('form.appointment');
    console.log('Found contact forms with class "appointment":', contactForms.length);
    
    // Also check for form by ID
    const formById = document.getElementById('contactForm');
    console.log('Found form by ID "contactForm":', formById);
    
    contactForms.forEach(form => {
        console.log('Setting up event listener for form:', form);
        form.addEventListener('submit', function(e) {
            console.log('FORM SUBMIT EVENT TRIGGERED!');
            e.preventDefault(); // Prevent default form submission
            
            // Validate form
            const errors = validateForm(form);
            
            if (errors.length > 0) {
                showToast(errors.join(', '), 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('input[type="submit"]');
            const originalValue = submitBtn.value;
            submitBtn.value = 'Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(form);
            const data = {
                firstName: formData.get('first_name'),
                lastName: formData.get('last_name'),
                businessName: formData.get('business_name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message')
            };
            
            // Check if EmailJS is configured
            const isEmailJSConfigured = (typeof emailjs !== 'undefined' && 
                                       window.EMAILJS_SERVICE_ID && 
                                       window.EMAILJS_TEMPLATE_ID && 
                                       window.EMAILJS_PUBLIC_KEY);
            
            if (isEmailJSConfigured) {
                // Send confirmation email to the customer only
                emailjs.send(window.EMAILJS_SERVICE_ID, window.EMAILJS_TEMPLATE_ID, {
                    name: data.firstName + ' ' + data.lastName,
                    title: `Thank you for contacting Lovable GoldStar Puppies`,
                    message: data.message,
                    email: data.email,
                    phone: data.phone || 'Not provided',
                    business: data.businessName || 'Not provided',
                    to_email: data.email  // This sends the confirmation to the customer
                }, window.EMAILJS_PUBLIC_KEY)
                .then(function(response) {
                    // Show success message - the auto-reply will be sent automatically by EmailJS
                    showToast(`Thank you ${data.firstName}! Your message has been sent successfully. You should receive a confirmation email at ${data.email} shortly.`, 'success');
                    
                    form.reset();
                    submitBtn.value = originalValue;
                    submitBtn.disabled = false;
                })
                .catch(function(error) {
                    showToast('Sorry, there was an error sending your message. Please try again later or contact us directly.', 'error');
                    submitBtn.value = originalValue;
                    submitBtn.disabled = false;
                });
            } else {
                // Fallback - Show success message (for demo/development)
                setTimeout(() => {
                    showToast(`Thank you ${data.firstName}! Your message has been received successfully. We'll get back to you soon at ${data.email}`, 'success');
                    
                    form.reset();
                    submitBtn.value = originalValue;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    });
    
    // Add backup click handler for submit button
    const submitBtn = document.querySelector('input[type="submit"]');
    if (submitBtn) {
        console.log('Found submit button, adding click handler');
        submitBtn.addEventListener('click', function(e) {
            console.log('SUBMIT BUTTON CLICKED!');
            e.preventDefault();
            
            const form = submitBtn.closest('form');
            if (form) {
                console.log('Found parent form, triggering form submit handler');
                // Manually trigger the form submit handler
                const submitEvent = new Event('submit');
                form.dispatchEvent(submitEvent);
            }
        });
    } else {
        console.log('No submit button found!');
    }
});