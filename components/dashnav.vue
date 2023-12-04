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
</template>