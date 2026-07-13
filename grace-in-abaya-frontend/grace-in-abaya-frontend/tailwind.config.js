export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rose:   { DEFAULT: '#8B3252', light: '#A84D6A', dark: '#6B2240' },
        gold:   { DEFAULT: '#C19A6B', light: '#D4B483', dark: '#9E7A4A' },
        cream:  { DEFAULT: '#FAF8F5', dark: '#F0EBE3' },
        mink:   { DEFAULT: '#6B5B52', light: '#8C7B72' },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"Nunito Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
