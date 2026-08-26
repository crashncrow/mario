import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Mirrors jsconfig.json's `baseUrl: "."` so bare imports like
// `libs/world/collision` resolve the same way they do for Next.js.
export default defineConfig({
  resolve: {
    alias: {
      libs: path.resolve(dirname, 'libs'),
      hooks: path.resolve(dirname, 'hooks'),
      components: path.resolve(dirname, 'components'),
      contexts: path.resolve(dirname, 'contexts'),
    },
  },
  test: {
    environment: 'node',
  },
})
