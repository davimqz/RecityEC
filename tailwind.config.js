/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sage': '#B7C9A9',
        'cream': '#FAF6EF',
        'terracotta': '#E7BFA7',
        'blue-gray': '#A9C9D3',
        'soft-graphite': '#3A3A3A',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'raleway': ['Raleway', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'gentle-bounce': 'gentleBounce 2s ease-in-out infinite',
        'organic-pulse': 'organicPulse 3s ease-in-out infinite alternate',
      },
      backgroundImage: {
        'organic-texture': "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"20\" cy=\"20\" r=\"1\" fill=\"%23000\" opacity=\"0.02\"/><circle cx=\"80\" cy=\"80\" r=\"1\" fill=\"%23000\" opacity=\"0.02\"/><circle cx=\"40\" cy=\"70\" r=\"1\" fill=\"%23000\" opacity=\"0.02\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}