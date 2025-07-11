export default defineNuxtConfig({
  devtools: { enabled: false },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css:["~/assets/css/main.css"],
  runtimeConfig:{
    public:{
      apiUrl:process.env.API_URL
    }
  },

  modules:[],

  app:{
    head:{
      title:"anomz",
      meta:[
        {
          property:"og:title",
          content:"Anomz"
        },
        {
          property:"og:description",
          content:"Anomz free and open source chat software"
        },
        {
          property:"og:image",
          content:"/anomz2.png"
        },
        {
          property:"og:type",
          content:"website"
        },
        {
          property:"og:url",
          content:"https://anomz.software"
        },
        {
          property:"og:locale",
          content:"en_GB"
        },
        {
          property:"og:locale:alternate",
          content:"en_US"
        },
        {
          property:"og:locale:alternate",
          content:"tr_TR"
        },
        {
          name:"description",
          content:"Anomz free and open source chat software"
        },
        {
          name:"keywords",
          content:"anomz, arasemr12, arasemr1234, github, chat, software, open_source"
        },
        {
          name:"author",
          content:"arasemr12"
        },
      ],
      script:[
        {
          src:"https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.2/socket.io.js",
          integrity:"sha512-zoJXRvW2gC8Z0Xo3lBbao5+AS3g6YWr5ztKqaicua11xHo+AvE1b0lT9ODgrHTmNUxeCw0Ry4BGRYZfXu70weg==",
          crossorigin:"anonymous",
          referrerpolicy:"no-referrer"
        },
        {
          src:"https://www.googletagmanager.com/gtag/js?id=G-Y7SZD3FFP8",
          async:true
        }
      ],
      link:[
        {
          rel:"icon",
          type:"image/x-icon",
          href:"/favicon.ico"
        },
        {
            rel:"stylesheet",
            href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
            integrity:"sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==",
            crossorigin:"anonymous",
            referrerpolicy:"no-referrer"
        },
        {
          rel:"manifest",
          href:"/manifest.json"
        }
      ],
    }
  },

  compatibilityDate: "2024-09-29"
})