/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--color-brand-primary)',
        'brand-dark': 'var(--color-brand-dark)',
        'brand-medium': 'var(--color-brand-medium)',
        'brand-light': 'var(--color-brand-light)',
        'brand-accent': 'var(--color-brand-accent)',
        'brand-rose': 'var(--color-brand-rose)',
        'brand-text': 'var(--color-text-primary)',
        'brand-secondary': 'var(--color-bg-secondary)',
        'brand-background': 'var(--color-bg-primary)',
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-dark': 'var(--color-bg-dark)',
        'bg-card': 'var(--color-bg-card)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'text-on-dark': 'var(--color-text-on-dark)',
        'success': 'var(--color-success)',
        'warning': 'var(--color-warning)',
        'error': 'var(--color-error)',
        'badge-unavailable': 'var(--color-badge-unavailable)',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        cursive: ['Great Vibes', 'cursive'],
      },
      fontSize: {
        'display-lg': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['5.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(44, 24, 16, 0.04), 0 4px 16px rgba(44, 24, 16, 0.06)',
        'card-hover': '0 4px 12px rgba(44, 24, 16, 0.08), 0 16px 40px rgba(44, 24, 16, 0.12)',
        'nav': '0 1px 0 rgba(44, 24, 16, 0.06)',
        'soft': '0 2px 20px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
      },
      transitionDuration: {
        '400': '400ms',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'ken-burns': 'kenBurns 25s ease-in-out infinite alternate',
        'scroll-pulse': 'scrollPulse 2.5s ease-in-out infinite',
        'float': 'floatParticle 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'bounce-once': 'bounceOnce 0.4s ease-out',
      },
      keyframes: {
        bounceOnce: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.12)' },
        },
        scrollPulse: {
          '0%, 100%': { opacity: '0.3', transform: 'translateX(-50%) translateY(0)' },
          '50%': { opacity: '0.7', transform: 'translateX(-50%) translateY(6px)' },
        },
        floatParticle: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.4' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)', opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
