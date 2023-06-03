const withMT = require("@material-tailwind/react/utils/withMT");
/** @type {import('tailwindcss').Config} */

module.exports = withMT({
    content: ["./src/**/*.{html,js}"],
    theme: {
      extend: {
        transitionDuration: {
          'default': '2000ms',
        '200': '200ms',
        '500': '500ms',
        },
          transitionTimingFunction: {
            'default': 'ease',
        'linear': 'linear',
        'ease-in': 'ease-in',
        'ease-out': 'ease-out',
        'ease-in-out': 'ease-in-out',
          },
      },
    },
    plugins: [],
});

