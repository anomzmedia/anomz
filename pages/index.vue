<script setup>
const s = ref(true);

onMounted(() => {
    
});

const features = ref([
    {
        title:"Security",
        content:"Anomz keeps your data private"
    },
    {
        title:"Open source",
        content:"Anomz is open source project"
    },
    {
        title:"User Friendly",
        content:"User Friendly"
    },
    {
        title:"Compatibility",
        content:"Anomz compatible every device"
    }
])

</script>

<template>
    <div class="w-full h-full">
        <!--<div v-if="s" class="fixed bottom-4 right-4 py-2 px-4 bg-gray-800 flex flex-row items-center gap-3 text-xs rounded z-50">
            <img src="/anomz2.png" draggable="false" width="32" height="32" alt="">
            <span>Anomz</span>
            <span>|</span>
            <span>Join Us!</span>
            <button class="py-1 px-2 bg-gray-700 rounded-full">Discord</button>
            <span class="w-[10px] h-[10px] bg-white block rounded-full cursor-pointer" @click="s = !s"></span>
        </div>-->
        <div class="w-full h-full flex items-center justify-center">
            <!--<img class="absolute top-0 left-0 w-full h-full z-10" src="/bg.jpg" alt="">-->
            <span class="block absolute top-0 left-0 w-full h-full z-10 bg-[url('/bg.jpg')] bg-cover"></span>
            <span class="block absolute top-0 left-0 w-full h-full z-20 bg-gradient-to-bl to-black from-black/30"></span>
            <div data-aos="fade-down" class="lg:w-2/3 w-full h-full flex flex-col items-center justify-center gap-6 z-30">
                <div class="flex flex-col gap-3 items-center">
                    <img src="/anomz2.png" width="128" height="128" class="rounded-full" draggable="false" alt="">
                    <h1 class="text-4xl font-semibold">Anomz</h1>
                </div>
                <span id="tt" class="text-xl">Free and open source chat software</span>
                <div class="flex lg:flex-row flex-col items-center gap-3">
                    <nuxt-link to="/dashboard" class="py-2 px-4 border-2 hover:bg-white hover:text-black rounded-full duration-300">Dashboard</nuxt-link>
                    <a href="#features" class="py-2 px-4 border-2 hover:bg-white hover:text-black rounded-full duration-300">Anomz features</a>
                </div>
            </div>
        </div>
        <div id="features" class="w-full h-full flex items-center justify-center bg-black relative">
            <!--<span class="glowbg lg:w-[500px] lg:h-[500px] w-full h-full"></span>-->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 blur-[12vh] z-10 opacity-70" style="background-image:linear-gradient(to right top,#4f46e5,#7c3aed,#9333ea,#c026d3,#db2777,#e11d48);"></div>
            <div data-aos="fade-down" data-aos-delay="0" class="lg:w-2/3 w-full h-full flex flex-col lg:flex-row items-center z-20">
                <div class="flex flex-col lg:w-1/2 w-full gap-3">
                    <h1 class="text-2xl font-semibold">Anomz Features</h1>
                    <button v-for="feature in features" class="flex flex-row items-center justify-between border-2 border-gray-800 bg-gray-900/70 hover:bg-gray-800/70 backdrop-blur-sm rounded-lg py-2 px-4 gap-1 duration-300">
                        <div class="flex flex-col items-start">
                            <span>{{feature.title}}</span>
                            <span class="text-gray-400">{{ feature.content }}</span>
                        </div>
                        <div class="w-[36px] h-[36px] relative bg-white rounded-full">
                            <i class="fa-solid fa-star text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>
                        </div>
                    </button>
                </div>
                <div class="lg:flex flex-col lg:w-1/2 w-full items-center justify-center p-24 hidden">
                    <img class="w-full h-full" draggable="false" src="/anomz2.png" alt="">
                </div>
            </div>
        </div>
        <Footer/>
    </div>
</template>