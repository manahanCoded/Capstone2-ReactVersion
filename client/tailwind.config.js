/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html', // Include your HTML file if it's directly in the root
    './src/**/*.{js,ts,jsx,tsx}', // Include all JS/TS/JSX/TSX files in the src directory
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        custom: ['CustomFont', 'CryptoHunter'],
        pxltd: ['AeogoPxltd', 'AeogoPxltd'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      animation: {
        move: 'move 5s linear infinite',
        moveInverse: 'moveInverse 5s linear infinite',
        slide: 'slide 10s linear infinite',
        shake: 'shake 2s',
        fall: 'fall 3s',
      },
      keyframes: {
        move: {
          '0%,100%': {
            transform: 'translateY(-10px)',
          },
          '50%': {
            transform: 'translateY(50px)',
          },
        },
        moveInverse: {
          '0%,100%': {
            transform: 'translateY(10px)',
          },
          '50%': {
            transform: 'translateY(-50px)',
          },
        },
        slide: {
          from: {
            transform: 'translateX(0)',
          },
          to: {
            transform: 'translateX(-100%)',
          },
        },
        shake: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '10%': {
            transform: 'rotate(10deg)',
          },
          '30%': {
            transform: 'rotate(-10deg)',
          },
          '45%': {
            transform: 'rotate(5deg)',
          },
          '55%': {
            transform: 'rotate(-5deg)',
          },
          '60%': {
            transform: 'rotate(0deg)',
          },
        },
        fall: {
          '0%': {
            transform: 'translateY(0)',
          },
          '100%': {
            transform: 'translateY(200px)',
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-motion'), require('tailwindcss-animate')],
}
