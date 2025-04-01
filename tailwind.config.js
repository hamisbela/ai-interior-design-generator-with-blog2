/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Add aspect ratio utilities for video embeds
      aspectRatio: {
        'auto': 'auto',
        'square': '1 / 1',
        '16/9': '16 / 9',
        '4/3': '4 / 3',
        '21/9': '21 / 9',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addComponents, theme }) {
      addComponents({
        '.aspect-w-16': {
          position: 'relative',
          paddingBottom: '56.25%',
        },
        '.aspect-h-9': {
          position: 'relative',
        },
        '.aspect-w-16 > iframe': {
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
          width: '100%',
          height: '100%',
        },
      });
    }
  ],
};