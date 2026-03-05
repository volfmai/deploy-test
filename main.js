class ThemeManager {
    constructor(toggleSelector) {

        this.toggle = document.querySelector(toggleSelector);

        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        this.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.applyTheme(this.currentTheme);

        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleTheme());
        }

        const media = window.matchMedia('(prefers-color-scheme: dark)');

        media.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });

        window.addEventListener('storage', (e) => {
            if (e.key === 'theme') {
                this.applyTheme(e.newValue || 'light');
            }
        });
    }

    applyTheme(theme) {

        const html = document.documentElement;

        html.classList.remove('light', 'dark');
        html.classList.add(theme);

        const meta = document.querySelector('meta[name="theme-color"]');

        if (meta) {
            meta.setAttribute(
                'content',
                theme === 'dark' ? '#1a1a1a' : '#ffffff'
            );
        }

        this.currentTheme = theme;
    }

    toggleTheme() {

        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';

        localStorage.setItem('theme', newTheme);

        this.applyTheme(newTheme);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new ThemeManager('#theme-toggle');
});
