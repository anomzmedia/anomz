<script setup>

const nav = ref(false);

const user = useState("user");

const router = useRouter();

const token = useCookie("token");

const logout = () => {
    token.value = "";    
    user.value = null;

    router.push("/login");

    closeIO();
};

</script>

<template>
    <i v-if="!router.currentRoute.value.fullPath.toLowerCase().includes('dashboard')" class="fa-solid fa-bars fa-2x z-50 mt-4 ml-4 fixed top-0 left-0 lg:hidden block" @click="nav = !nav"></i>
    <div class="fixed top-0 left-0 w-full h-full bg-black/50 flex flex-col items-center gap-10 pt-32 z-40" v-if="!router.currentRoute.value.fullPath.toLowerCase().includes('dashboard') && nav">
        <nuxt-link to="/">
            <img src="/anomz.png" width="64" alt="">
        </nuxt-link>
        <div v-if="user" class="flex flex-col items-center gap-5">
            <nuxt-link to="/donation">Donation</nuxt-link>
            <nuxt-link to="/dashboard">Dashboard</nuxt-link>
            <a @click="logout">Logout</a>
        </div>
        <div v-else class="flex flex-col items-center gap-5">
            <nuxt-link to="/donation">Donation</nuxt-link>
            <nuxt-link to="/login">Login</nuxt-link>
        </div>
    </div>
</template>