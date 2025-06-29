import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'lightPeachTheme',
    themes: {
      lightPeachTheme: {
        dark: false,
        colors: {
          background: '#FFF0F0',
          surface: '#FFF8F8',
          primary: '#FF9A8D',
          'primary-darken-1': '#FF7060',
          secondary: '#FFE0B2',
          'secondary-darken-1': '#FFCC80',
          accent: '#FFC0CB',
          error: '#EF5350',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          'on-background': '#5A4A4A',
          'on-surface': '#5A4A4A',
          'on-primary': '#FFFFFF',
          'on-secondary': '#5A4A4A',
        },
      },
      darkFootballTheme: {
        dark: true,
        colors: {
          background: '#151522',
          surface: '#1E1E2D',
          primary: '#7B66FF',
          'primary-darken-1': '#6A57E0',
          secondary: '#FFD700',
          'secondary-darken-1': '#E0BF00',
          accent: '#00D1B2',
          error: '#FF4136',
          info: '#00BFFF',
          success: '#32CD32',
          warning: '#FF8C00',
          'on-background': '#E0E0EB',
          'on-surface': '#E0E0EB',
          'on-primary': '#FFFFFF',
          'on-secondary': '#151522',
        },
      },
    },
  },
})