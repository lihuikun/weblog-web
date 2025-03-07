/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
    extend: {
      colors: {
        // 定义亮色模式和暗色模式下的颜色
        gray: {
          50: 'var(--color-gray-50)',
        },
        white: 'var(--color-bg-white)',
      },
      textColor:{
        white: 'var(--color-text-white)',
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'], // 启用 dark 模式下的背景颜色变体
    },
  },
  plugins: [],
}