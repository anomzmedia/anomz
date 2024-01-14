<script setup>

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
    <nav v-if="!router.currentRoute.value.fullPath.toLowerCase().includes('dashboard')" class="w-full z-50 hidden lg:flex flex-row items-center justify-between absolute py-2 px-4">
        <div>
            <nuxt-link to="/" class="flex flex-row items-center gap-2">
                <img src="/anomz2.png" width="32" height="32">
                <span class="font-semibold">Anomz</span>
            </nuxt-link>
        </div>
        <div v-if="user" class="flex flex-row items-center gap-3">
            <nuxt-link to="/donation">Donation</nuxt-link>
            <nuxt-link to="/dashboard">Dashboard</nuxt-link>
            <button @click="logout">Logout</button>
        </div>
        <div v-else class="flex flex-row items-center gap-3">
            <nuxt-link to="/donation">Donation</nuxt-link>
            <nuxt-link to="/login">Login</nuxt-link>
        </div>
    </nav>
</template>