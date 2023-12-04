<script setup>

const nav = ref(false);

</script>

<template>
    <div class="h-full w-full lg:w-1/6 py-2 px-4 bg-gray-800 gap-3 hidden lg:flex flex-col items-center">
        <nuxt-link to="/">
            <img src="/favicon.svg" width="64" alt="">
        </nuxt-link>
        <div class="flex flex-col items-center w-full overflow-auto gap-3">
            <nuxt-link class="dashnav_link" to="/dashboard/">Dashboard</nuxt-link>
            <nuxt-link class="dashnav_link" to="/dashboard/friends">Friends</nuxt-link>
            <nuxt-link class="dashnav_link" to="/dashboard/profile">Profile</nuxt-link>
        </div>
    </div>
    <i class="lg:hidden block fixed top-0 left-0 fa-solid fa-bars fa-2x ml-4 mt-4 z-50" @click="nav = !nav"></i>
    <div v-if="nav" class="fixed top-0 left-0 bg-black/50 w-full h-full flex flex-col items-center justify-center gap-5 z-40">
        <nuxt-link to="/dashboard">Dashboard</nuxt-link>
        <nuxt-link to="/dashboard/friends">Friends</nuxt-link>
        <nuxt-link to="/dashboard/profile">Profile</nuxt-link>
    </div>
</template>