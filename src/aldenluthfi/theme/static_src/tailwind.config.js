/**
 * This is a minimal config.
 *
 * If you need the full config, get it from here:
 * https://unpkg.com/browse/tailwindcss@latest/stubs/defaultConfig.stub.js
 */
module.exports = {
    darkMode: 'class',
    content: [
        /**
         * HTML. Paths to Django template files that will contain Tailwind CSS classes.
         */

        /*  Templates within theme app (<tailwind_app_name>/templates), e.g. base.html. */
        '../templates/**/*.html',

        /*
         * Main templates directory of the project (BASE_DIR/templates).
         * Adjust the following line to match your project structure.
         */
        '../../templates/**/*.html',

        /*
         * Templates in other django apps (BASE_DIR/<any_app_name>/templates).
         * Adjust the following line to match your project structure.
         */
        '../../**/templates/**/*.html',

        /**
         * JS: If you use Tailwind CSS in JavaScript, uncomment the following lines and make sure
         * patterns match your project structure.
         */
        /* JS 1: Ignore any JavaScript in node_modules folder. */
        '!../../**/node_modules',
        /* JS 2: Process all JavaScript files in the project. */
        '../../**/*.js',

        /* Process all svg files */
        '../../**/*.svg',

        /**
         * Python: If you use Tailwind CSS classes in Python, uncomment the following line
         * and make sure the pattern below matches your project structure.
         */
        '../../**/*.py'
    ],
    theme: {
        extend: {
            boxShadow: {
                'glow-md': '0 4px 6px -1px rgb(255 255 255 / 0.1), 0 2px 4px -2px rgb(255 255 255 / 0.1)',
                'glow-lg': '0 10px 15px -3px rgb(255 255 255 / 0.1), 0 4px 6px -4px rgb(255 255 255 / 0.1)',
                'glow-xl': '0 20px 25px -5px rgb(255 255 255 / 0.1), 0 8px 10px -6px rgb(255 255 255 / 0.1)',
                'glow-article': '0 0 25px -5px rgb(255 255 255 / 0.2), 0 0 10px -6px rgb(255 255 255 / 0.2)',
                'article': '0 0 25px -5px rgb(0 0 0 / 0.1), 0 0 10px -6px rgb(0 0 0 / 0.1)'
            },
            dropShadow: {
                'glow-md': [
                    '0 4px 3px rgb(255 255 255 / 0.07)',
                    '0 2px 2px rgb(255 255 255 / 0.06)'
                ],
                'glow-lg': [
                    '0 10px 8px rgb(255 255 255 / 0.04)',
                    '0 4px 3px rgb(255 255 255 / 0.1)'
                ],
                'glow-xl': [
                    '0 20px 13px rgb(255 255 255 / 0.03)',
                    '0 8px 5px rgb(255 255 255 / 0.08)'
                ],
                'glow-2xl': '0 25px 25px rgb(255 255 255 / 0.15)'
            },
            spacing: {
                "6-hues": "236px",
                "desktop": "1024px",
            },
            transitionTimingFunction: {
                'bounce': 'cubic-bezier(0.59,-0.14,0.56,1.8)',
            },
            fontSize: {
                '10xl': ['10rem', '10rem'],
                '11xl': ['12rem', '12rem'],
                '12xl': ['14rem', '14rem'],
                '13xl': ['16rem', '16rem'],
                '14xl': ['18rem', '18rem'],
            },
            fontFamily: {
                'heading': [
                    "'heading', 'sans-serif'",
                    {
                        fontFeatureSettings: '"ss01", "ss03"',
                    }
                ],
                'heading-italic': [
                    "'heading-italic', 'sans-serif'",
                    {
                        fontFeatureSettings: '"ss01", "ss03"',
                    }
                ],
                'code': [
                    "'code', 'sans-serif'",
                    {
                        fontFeatureSettings: '"ss10", "ss01", "ss04", "cv30", "cv14", "ss07", "cv30", "ss09", "cv12"',
                    }
                ],
                'body': [
                    "'body', 'sans-serif'",
                    {
                        fontFeatureSettings: '"ss02", "ss03"',
                    }
                ],
                'body-bold': [
                    "'body-bold', 'sans-serif'",
                    {
                        fontFeatureSettings: '"ss02", "ss03"',
                    }
                ],
            },
            screens: {
                'tablet': '768px',
                'desktop': '1024px',
            },
            colors: {
                'transparent': 'transparent',
                'current': 'currentColor',

                'background': 'rgba(var(--background) / <alpha-value>)',
                'card-background': 'rgba(var(--card-background) / <alpha-value>)',
                'neutral-accent': 'rgba(var(--neutral-accent) / <alpha-value>)',

                'text': 'rgba(var(--text) / <alpha-value>)',
                'buttons-text': 'rgba(var(--buttons-text) / <alpha-value>)',
                'buttons-text-disabled': 'rgba(var(--buttons-text-disabled) / <alpha-value>)',

                'buttons-default': 'rgba(var(--buttons-default) / <alpha-value>)',
                'buttons-hover': 'rgba(var(--buttons-hover) / <alpha-value>)',
                'buttons-active': 'rgba(var(--buttons-active) / <alpha-value>)',
                'buttons-disabled': 'rgba(var(--buttons-disabled) / <alpha-value>)',

                'accent': 'rgba(var(--accent) / <alpha-value>)',
            }
        },
    },
    plugins: [
        /**
         * '@tailwindcss/forms' is the forms plugin that provides a minimal styling
         * for forms. If you don't like it or have own styling for forms,
         * comment the line below to disable '@tailwindcss/forms'.
        **/
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/aspect-ratio'),
    ],
}
