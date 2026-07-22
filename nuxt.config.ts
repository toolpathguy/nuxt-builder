export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/eslint'
  ],

  ssr: true,

  typescript: {
    strict: true,
    typeCheck: true
  },

  css: ['~/assets/css/main.css']
})
