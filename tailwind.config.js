/** @type {import('tailwindcss').Config} */

var pixels = {
  '.5': '0.5rem',
  '.8': '0.8rem',
  1: '1rem',
  1.5: '1.5rem',
  1.6: '1.6rem',
  2: '2rem',
  2.4: '2.4rem',
  2.5: '2.5rem',
  3: '3rem',
  3.2: '3.2rem',
  5: '5rem',
};

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    // extend: {},
    fontSize: pixels,
    spacing: pixels,
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: {
        500: '#517bbf',
        600: '#2d56a2',
        700: '#163c7a',
        800: '#0c2c5b',
        900: '#1b1d3d',
      },
      secondary: {
        500: '#def2f9',
        600: '#a5d9eb',
        700: '#46a2c6',
        800: '#2291bc',
        900: '#6bc4ef',
      },
      gray: {
        500: '#e4e7ec',
        600: '#98a2b3',
        700: '#667085',
        800: '#475467',
        900: '#101828',
      },
      success: {
        500: '#daf5e3',
        600: '#32d583',
        700: '#12b76a',
        800: '#027a48',
        900: '#05603a',
      },
      error: {
        500: '#fee4e2',
        600: '#f97066',
        700: '#d92d20',
        800: '#b42318',
        900: '#912018',
      },
      warning: {
        500: '#ffecda',
        600: '#fec84b',
        700: '#fdb022',
        800: '#f79009',
        900: '#dc6803',
      },
    },
  },
  plugins: [],
};
