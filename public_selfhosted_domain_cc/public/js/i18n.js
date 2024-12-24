class I18n {
    constructor() {
        this.translations = {};
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.init();
    }

    async init() {
        // Load the current language
        await this.loadLanguage(this.currentLanguage);
        
        // Set up language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
            languageSelect.addEventListener('change', async (e) => {
                const newLang = e.target.value;
                const oldLang = this.currentLanguage;
                await this.setLanguage(newLang);
                
                // Track language change event
                try {
                    await fetch('/api/track', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            type: 'language_change',
                            from: oldLang,
                            to: newLang
                        })
                    });
                } catch (error) {
                    console.error('Failed to track language change:', error);
                }
            });
        }

        // Initial translation
        this.translatePage();
    }

    async loadLanguage(lang) {
        try {
            const response = await fetch(`/translations/${lang}.json`);
            this.translations = await response.json();
        } catch (error) {
            console.error(`Failed to load language: ${lang}`, error);
            // Fallback to English if loading fails
            if (lang !== 'en') {
                await this.loadLanguage('en');
            }
        }
    }

    async setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        await this.loadLanguage(lang);
        this.translatePage();
    }

    translate(key) {
        return key.split('.').reduce((obj, i) => obj?.[i], this.translations) || key;
    }

    translatePage() {
        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });

        // Translate all elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.translate(key);
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
    }
}

// Initialize i18n when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new I18n();
}); 