/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
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