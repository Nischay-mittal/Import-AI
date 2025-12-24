import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: {
					DEFAULT: 'hsl(var(--background))',
					alt: 'hsl(var(--background-alt))'
				},
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			backdropBlur: {
				xs: '2px',
				'3xl': '64px'
			},
			fontFamily: {
				inter: ['Inter', 'system-ui', 'sans-serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(40px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'glow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
					'33%': { transform: 'translateY(-20px) translateX(10px)' },
					'66%': { transform: 'translateY(-10px) translateX(-10px)' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.7', transform: 'scale(1.05)' }
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'data-flow': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'50%': { opacity: '1' },
					'100%': { transform: 'translateX(100%)', opacity: '0' }
				},
				'agent-pulse': {
					'0%, 100%': { transform: 'scale(1)', opacity: '1' },
					'50%': { transform: 'scale(1.1)', opacity: '0.9' }
				},
				'network-pulse': {
					'0%, 100%': { opacity: '0.3' },
					'50%': { opacity: '0.8' }
				},
				'growth-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'highlight': {
					'0%': { 
						transform: 'scaleX(0) rotate(-1deg)',
						opacity: '0.8'
					},
					'50%': { 
						transform: 'scaleX(1) rotate(-1deg)',
						opacity: '1'
					},
					'100%': { 
						transform: 'scaleX(0) rotate(-1deg)',
						opacity: '0.8'
					}
				},
				'star-fall': {
					'0%': { 
						transform: 'translateY(-10px) translateX(0px)',
						opacity: '1',
						scale: '1'
					},
					'100%': { 
						transform: 'translateY(20px) translateX(10px)',
						opacity: '0',
						scale: '0.5'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'fade-in-up': 'fade-in-up 0.8s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'glow': 'glow 2s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
				'spin-slow': 'spin-slow 20s linear infinite',
				'data-flow': 'data-flow 3s ease-in-out infinite',
				'agent-pulse': 'agent-pulse 2s ease-in-out infinite',
				'network-pulse': 'network-pulse 2s ease-in-out infinite',
				'growth-up': 'growth-up 1s ease-out',
				'highlight': 'highlight 4s ease-in-out infinite',
				'star-fall': 'star-fall 2s ease-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
