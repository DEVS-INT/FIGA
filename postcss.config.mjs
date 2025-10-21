/** @type {import('postcss-load-config').Config} */
const enableTailwind = process.env.TAILWIND_ENABLE !== '0' && process.env.TAILWIND_SKIP !== '1'

const config = {
  plugins: enableTailwind
    ? {
        '@tailwindcss/postcss': {},
      }
    : {},
}

export default config
