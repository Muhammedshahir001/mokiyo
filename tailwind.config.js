/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mokiyo: {
          dark:      '#0a0a0a',
          card:      '#141414',
          border:    '#262626',
          accent:    '#FF4D00',
          electric:  '#0055FF',
          cream:     '#F4F2EE',
          muted:     '#8E8E93',
          lightgray: '#E5E5EA',
          cardgray:  '#F5F5F7',
        }
      },
      fontFamily: {
        sans:    ['Space Grotesk', 'Syne', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Space Grotesk', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        widest:  '0.25em',
        ultra:   '0.35em',
      },
      animation: {
        'marquee':          'marquee 25s linear infinite',
        'marquee-reverse':  'marquee-reverse 25s linear infinite',
        'pulse-slow':       'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':            'float 6s ease-in-out infinite',
        'fade-up':          'fadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in':          'fadeIn 0.5s ease both',
        'scale-in':         'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-left':       'slideLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-right':      'slideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'glow-pulse':       'glowPulse 2s ease-in-out infinite',
        'spin-slow':        'spinSlow 12s linear infinite',
        'shine':            'shine 1.6s ease-in-out',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.93)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        slideLeft: {
          from: { opacity: '0', transform: 'translateX(-32px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(32px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 77, 0, 0.35)' },
          '50%':      { boxShadow: '0 0 0 10px rgba(255, 77, 0, 0)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        shine: {
          '0%':       { transform: 'rotate(-45deg) translateX(-150%)' },
          '40%, 100%':{ transform: 'rotate(-45deg) translateX(250%)' },
        },
      },
      boxShadow: {
        'glow-orange': '0 0 20px rgba(255, 77, 0, 0.35)',
        'glow-sm':     '0 0 10px rgba(255, 77, 0, 0.2)',
        'inset-top':   'inset 0 1px 0 rgba(255,255,255,0.08)',
      },
      transitionTimingFunction: {
        'spring':  'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth':  'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
}
