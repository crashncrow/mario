import nextVitals from 'eslint-config-next/core-web-vitals'

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', '**/dist/**'],
  },
  ...nextVitals,
]

export default config
