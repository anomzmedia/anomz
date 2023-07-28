<script setup>
    const menuIsActive = ref(false);
</script>

<template>
    <div class="bg-gray-800 hidden lg:flex flex-col fixed items-center text-center h-full bg-opacity-50 w-1/6 gap-5 py-4 overflow-y-scroll">
        <nuxt-link to="/" class="w-full uppercase text-xl">Anomz</nuxt-link>
        <nuxt-link to="/dashboard/">Overview</nuxt-link>
        <nuxt-link to="/dashboard/friends">Friends</nuxt-link>
        <nuxt-link to="/dashboard/friends" class="relative w-full py-2 flex flex-row items-center justify-center"><span class="bg-red-600 left-4 top-0 py-2 px-3 rounded absolute z-20">0</span> Friend Requests</nuxt-link>
        <nuxt-link to="/dashboard/community">Community</nuxt-link>
    </div>
    <i @click="menuIsActive = !menuIsActive;" class="z-50 fa-solid fa-bars fa-2x block lg:hidden fixed top-1 left-1"></i>
    <div class="bg-black w-full h-full fixed top-0 left-0 z-40 flex flex-col items-center justify-center gap-1" v-if="menuIsActive">
        <nuxt-link to="/dashboard/">Overview</nuxt-link>
        <nuxt-link to="/dashboard/friends">Friends</nuxt-link>
        <nuxt-link to="/dashboard/friends">Friend Requests</nuxt-link>
        <nuxt-link to="/dashboard/community">Community</nuxt-link>
    </div>
</template>