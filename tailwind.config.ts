import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        amethyst_smoke: { DEFAULT: '#9c7bac', 100: '#201724', 200: '#402e49', 300: '#60446d', 400: '#7f5b92', 500: '#9c7bac', 600: '#b096bd', 700: '#c4b0ce', 800: '#d7cade', 900: '#ebe5ef' },
        pumpkin_spice: { DEFAULT: '#ff7f2d', 100: '#3c1700', 200: '#782e00', 300: '#b54500', 400: '#f15c00', 500: '#ff7f2d', 600: '#ff9858', 700: '#ffb282', 800: '#ffcbab', 900: '#ffe5d5' },
        sage_green: { DEFAULT: '#7cb078', 100: '#172516', 200: '#2e4b2c', 300: '#457042', 400: '#5c9558', 500: '#7cb078', 600: '#96c093', 700: '#b0cfae', 800: '#cbdfc9', 900: '#e5efe4' },
        pale_sky: { DEFAULT: '#d0e6ff', 100: '#002b5d', 200: '#0057ba', 300: '#1784ff', 400: '#74b5ff', 500: '#d0e6ff', 600: '#daebff', 700: '#e3f0ff', 800: '#edf5ff', 900: '#f6faff' },
        charcoal: { DEFAULT: '#4a4b4b', 100: '#0f0f0f', 200: '#1d1e1e', 300: '#2c2d2d', 400: '#3b3c3c', 500: '#4a4b4b', 600: '#6d6f6f', 700: '#919393', 800: '#b6b7b7', 900: '#dadbdb' },
        cool_sky: { DEFAULT: '#4cb1ff', 100: '#002642', 200: '#004b85', 300: '#0071c7', 400: '#0a95ff', 500: '#4cb1ff', 600: '#70c1ff', 700: '#94d1ff', 800: '#b8e0ff', 900: '#dbf0ff' },
        mint_cream: { DEFAULT: '#f5faf5', 100: '#214221', 200: '#428442', 300: '#71b871', 400: '#b3d9b3', 500: '#f5faf5', 600: '#f7fbf7', 700: '#f9fcf9', 800: '#fbfdfb', 900: '#fdfefd' },
        alice_blue: { DEFAULT: '#f2f8fc', 100: '#123851', 200: '#256fa1', 300: '#51a2d8', 400: '#a2cdea', 500: '#f2f8fc', 600: '#f5fafd', 700: '#f8fbfd', 800: '#fafcfe', 900: '#fdfefe' },
        snow: { DEFAULT: '#fef6f4', 100: '#5b1908', 200: '#b73211', 300: '#ed623f', 400: '#f6ac9a', 500: '#fef6f4', 600: '#fef9f8', 700: '#fefaf9', 800: '#fffcfb', 900: '#fffdfd' },
        ghost_white: { DEFAULT: '#f5f6fc', 100: '#171f4c', 200: '#2e3e98', 300: '#5b6cce', 400: '#a7b0e5', 500: '#f5f6fc', 600: '#f6f7fc', 700: '#f8f9fd', 800: '#fafbfe', 900: '#fdfdfe' }
      }
    },
  },
  plugins: [],
}
export default config
