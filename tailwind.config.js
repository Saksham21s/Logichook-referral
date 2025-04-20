module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#4361ee',
          secondary: '#3f37c9',
          accent: '#4895ef',
          dark: '#1b263b',
          light: '#f8f9fa',
          success: '#4cc9f0',
          warning: '#f72585',
        },
        boxShadow: {
          'xl': '0 10px 30px rgba(0, 0, 0, 0.1)',
        },
        borderRadius: {
          'xl': '12px',
        },
      },
    },
    plugins: [],
  }