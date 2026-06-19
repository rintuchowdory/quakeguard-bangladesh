import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0A0E1A',
          800: '#0F1625',
          700: '#141C2E',
          600: '#1E2D4A',
          500: '#253558',
        },
        seismic: {
          amber: '#F59E0B',
          red: '#EF4444',
          green: '#10B981',
          blue: '#3B82F6',
          orange: '#F97316',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'seismic': 'seismic 1.5s ease-in-out infinite',
      },
      keyframes: {
        seismic: {
          '0%, 100%': { transform: 'scaleX(1)', opacity: '1' },
          '50%': { transform: 'scaleX(1.05)', opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
export default config
