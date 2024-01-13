<script setup>

const {public:{apiUrl}} = useRuntimeConfig();

const nav = ref(false);

const user = useState("user");
const token = useCookie("token");

const avatar = ref(false);

const router = useRouter();

const logout = () => {
    router.push("/login");
    user.value = null;
    token.value = null;
};

const resetPassword = async() => {
    let res = await fetch(`${apiUrl}/api/auth/reset`,{
        method:"POST",
        headers:{
            Authorization:token.value
        }
    });

    let json = await res.json();

    const blob = new Blob([JSON.stringify({username:user.value.username,password:json.password}, null, 2)], {
        type: "application/json",
    });

    let u = URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.href = u;
    a.download = `credentials_${user.value.username}.json`
    document.body.appendChild(a);
    a.click();
    a.remove();

    router.push("/login");
    user.value = null;
    token.value = null;
};

</script>

<template>
    <div class="z-50 bg-black/30 w-full h-full absolute top-0 left-0 flex items-center justify-center" v-if="avatar">
        <div class="lg:w-2/3 lg:h-2/3 w-full h-full bg-gray-900 rounded-lg flex flex-col border-gray-700 border-[2px]">
            <div class="w-full bg-gray-800 p-2 rounded-tr-lg rounded-tl-lg flex flex-row items-center justify-between">
                <span>{{ user.username }}</span>
                <span class="bg-red-600 hover:bg-red-800 cursor-pointer duration-300 py-2 px-4 rounded-full font-semibold" @click="avatar = !avatar">X</span>
            </div>
            <span class="hr w-full h-[2px]"></span>
            <div class="w-full h-full bg-gray-800 overflow-auto rounded-bl-lg rounded-br-lg flex flex-col items-center gap-3 p-4">
                <img :src="user.profilePhoto" width="64" height="64" class="rounded-full w-[64px] h-[64px]" draggable="false" alt="">
                <button @click="resetPassword" class="green_rounded_btn">Reset Password</button>
                <button @click="logout" class="red_rounded_btn">Logout</button>
            </div>
        </div>
    </div>
    <div class="h-full w-full lg:w-1/6 py-2 px-4 bg-gray-800 gap-3 hidden lg:flex flex-col items-center">
        <nuxt-link to="/">
            <img src="/favicon.svg" width="64" alt="">
        </nuxt-link>
        <div class="flex flex-col justify-between items-center h-full w-full">
            <div class="w-full flex flex-col items-center overflow-auto gap-3">
                <nuxt-link class="dashnav_link" to="/dashboard/">Dashboard</nuxt-link>
                <nuxt-link class="dashnav_link" to="/dashboard/friends">Friends</nuxt-link>
                <nuxt-link class="dashnav_link" to="/dashboard/profile">Profile</nuxt-link>
                <nuxt-link class="dashnav_link" to="/dashboard/groups">Groups</nuxt-link>
            </div>
            <div @click="avatar = !avatar" class="flex flex-row items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 duration-300 border-[1px] border-gray-500 cursor-pointer w-full py-2 px-4 rounded-full" v-if="user">
                <img :src="user.profilePhoto" width="32" height="32" class="rounded-full w-[32px] h-[32px]" alt="">
                <span class="text-ellipsis overflow-hidden">{{ user.username }}</span>
            </div>
        </div>
    </div>
    <i class="lg:hidden block fixed top-0 left-0 fa-solid fa-bars fa-2x ml-4 mt-4 z-50" @click="nav = !nav"></i>
    <div v-if="nav" class="fixed top-0 left-0 bg-black/50 w-full h-full flex flex-col items-center justify-center gap-5 z-40">
        <nuxt-link to="/dashboard">Dashboard</nuxt-link>
        <nuxt-link to="/dashboard/friends">Friends</nuxt-link>
        <nuxt-link to="/dashboard/profile">Profile</nuxt-link>
    </div>
</template>