document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Popup functionality
    const popup = document.getElementById('popup');
    const popupBackdrop = document.getElementById('popupBackdrop');
    const closePopupButton = document.getElementById('closePopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupMessage = document.getElementById('popupMessage');
    const popupIcon = document.getElementById('popupIcon');

    const showPopup = (type, titleKey, messageKey) => {
        // Set content using translations
        popupTitle.textContent = window.i18n.translate(`popup.${type}.title`);
        popupMessage.textContent = window.i18n.translate(`popup.${type}.message`);

        // Set icon based on type
        if (type === 'success') {
            popupIcon.innerHTML = `
                <svg class="w-12 h-12 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `;
        } else if (type === 'error') {
            popupIcon.innerHTML = `
                <svg class="w-12 h-12 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `;
        }

        // Show popup
        popup.classList.remove('opacity-0', 'pointer-events-none');
        popup.querySelector('.bg-white').classList.remove('translate-y-8');
        
        // Auto-hide after 5 seconds
        setTimeout(hidePopup, 5000);
    };

    const hidePopup = () => {
        popup.classList.add('opacity-0', 'pointer-events-none');
        popup.querySelector('.bg-white').classList.add('translate-y-8');
    };

    // Close popup on backdrop click or close button
    if (popupBackdrop) {
        popupBackdrop.addEventListener('click', hidePopup);
    }
    if (closePopupButton) {
        closePopupButton.addEventListener('click', hidePopup);
    }

    // Waitlist form handling
    const form = document.getElementById('waitlistForm');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                email: document.getElementById('email').value,
                type: document.getElementById('type').value,
                location: document.getElementById('location').value
            };
            
            try {
                const response = await fetch('/api/waitlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    showPopup('success', 'Thank you!', 'You\'ve been added to our waitlist. We\'ll be in touch soon!');
                    form.reset();
                } else {
                    throw new Error('Failed to join waitlist');
                }
            } catch (error) {
                showPopup('error', 'Oops!', 'Something went wrong. Please try again later.');
                console.error('Error:', error);
            }
        });
    }
}); 