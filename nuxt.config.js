import { resolve } from 'path'
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  telemetry: process.env.NUXT_TELEMETRY_DISABLED,

  // env variables accessible via proces.env
  env: {
    BASE_URL: process.env.BASE_URL
  },

  // public and private configs
  // available on both server and client side
  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL
  },
  // available on server side
  privateRuntimeConfig: {},

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Invoice Parser',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@assets/scss/core.scss'],

  // aliases directory paths
  alias: {
    '@assets': resolve(__dirname, './assets'),
    '@utils': resolve(__dirname, './utils'),
    '@constants': resolve(__dirname, './constants')
  },

  // loading config
  loadingIndicator: {
    name: 'circle',
    color: '#7367f0',
    background: 'white'
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '@plugins/event-bus.js' }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://composition-api.nuxtjs.org/getting-started/setup
    '@nuxtjs/composition-api/module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://i18n.nuxtjs.org/
    'nuxt-i18n',
    // https://github.com/nuxt-community/dayjs-module
    '@nuxtjs/dayjs',
    // https://firebase.nuxtjs.org/guide/getting-started
    '@nuxtjs/firebase'
  ],

  // Or you can customize
  'nuxt-buefy': {
    css: false,
    materialDesignIcons: true
  },

  // dayjs config (https://github.com/nuxt-community/dayjs-module)
  dayjs: {
    locales: ['en'],
    defaultLocale: 'en',
    plugins: ['utc', 'relativeTime', 'customParseFormat', 'calendar']
  },

  // firebase
  firebase: {
    config: {
      apiKey: process.env.FIREBASE_APIKEY,
      authDomain: process.env.FIREBASE_AUTHDOMAIN,
      projectId: process.env.FIREBASE_PROJECTID,
      storageBucket: process.env.FIREBASE_STORAGEBUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
      appId: process.env.FIREBASE_APPID,
      measurementId: process.env.FIREBASE_MEASUREMENTID
    },
    services: {
      auth: true,
      firestore: {
        memoryOnly: false, // default
        chunkName:
          process.env.NODE_ENV !== 'production' ? 'firebase-auth' : '[id]', // default
        enablePersistence: true
      },
      storage: true,
      functions: {
        location: 'us-central1'
      }
    }
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    workbox: {
      // by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
      // only set this true for testing and remember to always clear your browser cache in development
      // dev: process.env.NODE_ENV === 'development'
    },
    manifest: {
      name: process.env.npm_package_name,
      lang: 'en',
      start_url: ''
    },
    meta: {},
    icons: {}
  },
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json'
      }
    ],
    strategy: 'no_prefix',
    lazy: true,
    langDir: 'locale/',
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en'
    }
  },
  apollo: {
    clientConfigs: {
      default: '~/plugins/apollo-config.js'
    },
    cookieAttributes: {
      expires: 1 // 1 day expiry
    },
    defaultOptions: {
      $query: {
        loadingKey: 'loading',
        fetchPolicy: 'cache-and-network'
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: process.env.NODE_ENV === 'production',
    transpile: ['vue-agile', 'resize-detector', 'drawflow'],
    parallel: true,
    build: {
      plugins: [new LodashModuleReplacementPlugin()],
      module: {
        rules: [
          {
            test: /\.js$/,
            // Exclude transpiling `node_modules`
            exclude: /node_modules\//,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['env']
              }
            }
          }
        ]
      }
    },
    babel: {
      plugins: ['lodash'],
      presets: [
        [
          '@nuxt/babel-preset-app',
          {
            corejs: { version: 3 }
          }
        ]
      ]
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.resolve.symlinks = false
    }
  },

  // Configure the generation of your universal web application to a static web application.
  generate: {
    interval: 2000,
    fallback: '404.html'
  }
}
