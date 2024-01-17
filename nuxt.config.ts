export default defineNuxtConfig({
  devtools: { enabled: false },
  modules:["@nuxtjs/tailwindcss"],
  tailwindcss:{
    viewer:false,
    configPath:"~/tailwind.config.js",
    cssPath:"~/assets/css/main.css"
  },
  runtimeConfig:{
    public:{
      apiUrl:process.env.API_URL
    }
  },
  app:{
    head:{
      title:"anomz",
      script:[
        {
          src:"https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.2/socket.io.js",
          integrity:"sha512-zoJXRvW2gC8Z0Xo3lBbao5+AS3g6YWr5ztKqaicua11xHo+AvE1b0lT9ODgrHTmNUxeCw0Ry4BGRYZfXu70weg==",
          crossorigin:"anonymous",
          referrerpolicy:"no-referrer"
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
        }
      ],
    }
  }
})
