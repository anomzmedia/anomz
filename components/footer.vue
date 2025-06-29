<script setup>


const email = ref("");

const subscribe = () => {};

</script>

<template>
    <footer class="flex flex-col w-full bg-black py-8 px-4 gap-5 text-sm">
        <div class="flex flex-col lg:flex-row items-center justify-between">
            <img draggable="false" src="/anomz2.png" width="64" alt="">
            <div class="flex flex-col">
                <span>About Anomz</span>
                <nuxt-link class="text-gray-400" to="/pricing">Pricing</nuxt-link>
            </div>
            <!--<div class="flex flex-col">
                <span>About Anomz</span>
                <span class="text-gray-400">Anomz features</span>
            </div>
            <div class="flex flex-col">
                <span>About Anomz</span>
                <span class="text-gray-400">Anomz features</span>
            </div>-->
            <!--<div class="flex flex-col">
                <span>Subscribe</span>
                <div class="flex flex-row items-center border-2 py-2 px-4 rounded">
                    <input placeholder="anomz@example.com" type="text" class="bg-black p-0" v-model="email">
                    <i class="fa-solid fa-arrow-right-to-bracket cursor-pointer" @click="subscribe"></i>
                </div>
            </div>-->
        </div>
        <div class="flex flex-col lg:flex-row items-center justify-between w-full">
            <span>@ {{new Date().getFullYear()}} Anomz Privacy Terms Security</span>
            <div class="flex flex-row items-center">
                <!--<i class="fa-brands fa-discord fa-2x"></i>-->
            </div>
        </div>
    </footer>
</template>