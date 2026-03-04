class ThemeManager {
    constructor(toggleSelector) {
        this.toggle = document.querySelector(toggleSelector);
        const userSaved = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentTheme = userSaved || (systemPrefersDark ? 'dark' : 'light');
        this.applyTheme(this.currentTheme);
        
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleTheme());
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light', false);
            }
        });
        
        window.addEventListener('storage', (e) => {
            if (e.key === 'theme') {
                const newTheme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.setTheme(newTheme || (prefersDark ? 'dark' : 'light'), false); 
            }
        });
    }

    applyTheme(theme) {
        const html = document.documentElement;
        const hasDarkClass = html.classList.contains('dark');
        const currentTheme = hasDarkClass ? 'dark' : 'light'; 
        
        if (currentTheme !== theme) {
            html.classList.remove('light', 'dark');
            html.classList.add(theme);
        }

        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) {
            themeColor.setAttribute(
                'content',
                theme === 'dark' ? '#1a1a1a' : '#FFFFFF'
            );
        }
    }

    setTheme(theme, save = true) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        if (save) {
            localStorage.setItem('theme', theme);
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme, true);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new ThemeManager('#theme-toggle');

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration.scope);
                registration.update();
            })
            .catch(error => {
                console.error('❌ Service Worker registration failed:', error);
            });
    }
});
