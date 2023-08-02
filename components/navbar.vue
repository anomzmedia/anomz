<script setup>
    import {logout} from "../composables/auth";

    const route = useRoute();

    const user = useState("user");
    const dropdownIsOpen = ref(false);
    const navIsOpen = ref(true);

    const dropdown = () => {
        dropdownIsOpen.value = !dropdownIsOpen.value;
    };

    const nav = () => {
        navIsOpen.value = !navIsOpen.value
    }
</script>


<template>
    <nav v-if="!route.path.includes('dashboard')" class="fixed top-0 left-0 py-2 px-4 w-full flex flex-col lg:flex-row items-center justify-between z-40">
        <div class="w-full lg:w-auto flex flex-row items-center justify-between">
            <nuxt-link to="/" class="text-xl flex flex-row items-center gap-2"><img src="/favicon.svg" width="32" height="32" alt="">Anomz</nuxt-link>
            <i class="fa-solid fa-bars fa-2x cursor-pointer lg:hidden" @click="nav"></i>
        </div>
        <div class="flex flex-col lg:flex-row items-center gap-5" v-if="navIsOpen">
            <nuxt-link to="/donation">donation</nuxt-link>
            <nuxt-link to="/financial">financial status</nuxt-link>
            <div class="flex flex-col lg:flex-row items-center gap-5" v-if="user">
                <nuxt-link to="/dashboard/">dashboard</nuxt-link>
                <nuxt-link to="/">{{user.username}}</nuxt-link>
                <div class="relative h-full">
                    <img @click="dropdown" :src="user.profilePhoto" width="32" draggable="false" class="rounded-full cursor-pointer max-h-full h-full" alt="">
                    <span class="border-2 border-green-600 animate-ping text-green-600 bg-green-600 w-2 h-2 block rounded-full absolute right-0 bottom-0"></span>
                    <div :class="`right-0 z-50 absolute bg-gray-700 py-2 px-4 rounded-lg flex flex-col gap-2 duration-300 ${dropdownIsOpen ? 'opacity-100 visible dropdownopenanim' : 'opacity-0 invisible dropdowncloseanim'}`">
                        <nuxt-link to="/profile">profile</nuxt-link>
                        <span class="cursor-pointer" @click="logout">logout</span>
                    </div>
                </div>
            </div>
            <div class="flex flex-col lg:flex-row items-center gap-5" v-else>
                <nuxt-link to="/login">login</nuxt-link>
            </div>
        </div>
    </nav>
</template>
