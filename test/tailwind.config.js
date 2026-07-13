/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // 关闭 preflight，避免重置 antd v5 自带样式，二者可共存
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1677FF',
          light: '#4096FF',
          dark: '#0958D9',
        },
        success: '#52C41A',
        error: '#FF4D4F',
        warning: '#FAAD14',
      },
      fontFamily: {
        sans: ['PingFang SC', 'Microsoft YaHei', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
