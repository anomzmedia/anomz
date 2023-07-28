export default defineNuxtConfig({
    app:{
        head:{
            title:"anomz",
            meta:[],
            link:[
                {
                    rel:"stylesheet",
                    href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
                    integrity:"sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==",
                    crossorigin:"anonymous",
                    referrerpolicy:"no-referrer"
                },
                {
                    rel:"icon",
                    type:"image/svg+xml",
                    href:"/favicon.svg"
                }
            ],
            script:[
                {
                    src:"https://www.google.com/recaptcha/api.js",
                    defer:true,
                    async:true
                },
                {
                    src:"https://js.stripe.com/v3/"
                }
            ]
        },
    },
    css:[
        "assets/css/main.css"
    ],
    modules:[
        "@nuxtjs/tailwindcss",
        "@formkit/nuxt",
    ],
    tailwindcss:{
        viewer:false,
        cssPath:"assets/css/main.css",
        configPath:"tailwind.config.js"
    },
    ssr:false,
    runtimeConfig:{
        mongoURL:process.env.MONGO_URL,
        SECRET:process.env.SECRET,
        stripePrivateKey:process.env.STRIPE_PRIVATE_KEY,
        webSocketPort:process.env.WEB_SOCKET_PORT,
        public:{
            socketLink: process.env.SOCKET_LINK,
            webLink: process.env.WEB_LINK,
            stripePublicKey:process.env.STRIPE_PUBLIC_KEY
        }
    },
    nitro:{
        plugins:["~/server/index.js"]
    }
});
