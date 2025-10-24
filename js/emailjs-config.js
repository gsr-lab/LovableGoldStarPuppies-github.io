// EmailJS Configuration
window.EMAILJS_SERVICE_ID = 'service_pohpw3d';
window.EMAILJS_TEMPLATE_ID = 'template_4fngca5';
window.EMAILJS_PUBLIC_KEY = '-_Pvi1S2v0KuErJdf';

// Initialize EmailJS when the page loads
document.addEventListener('DOMContentLoaded', function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(window.EMAILJS_PUBLIC_KEY);
    }
});