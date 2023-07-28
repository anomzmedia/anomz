<script setup>

    import useAPI from "~/composables/axios";

    definePageMeta({
        middleware: [
            'no-auth',
        ],
    });

    const axios = useAPI();

    let loading = ref(false);

    let username = ref("");
    let password = ref("");
    let err = ref("");

    const submit = async() => {
        if(loading.value) return;

        loading.value = true;

        let res = await axios.post("/api/auth/register",{
            username:username.value,
            password:password.value
        });

        loading.value = false;

        let data = res.data;

        if(data.success) return useRouter().push("/login");

        err.value = data.message;
    };
</script>

<template>
    <form @submit.prevent="submit" class="main lg:h-2/3 flex flex-row items-center justify-center rounded-lg relative">
        <img src="/arasemr12_ubuntu_2a5cbf0a-8cac-4598-baab-b190706ee3d5.png" draggable="false" class="w-1/2 h-full rounded-tl-lg rounded-bl-lg lg:block hidden" alt="">
        <div class="w-full lg:w-1/2 bg-gray-800 rounded-tr-lg rounded-br-lg h-full flex flex-col items-center justify-center p-4 gap-5">
            <span class="text-2xl">Register</span>
            <input v-model="username" type="text" class="w-full" placeholder="username" autocomplete="off">
            <input v-model="password" type="text" class="w-full" placeholder="password" autocomplete="off">
            <button v-if="loading" class="scbtn w-full flex items-center justify-center"><Loading/></button>
            <button v-else class="scbtn w-full">register</button>
            <nuxt-link class="w-full link" to="/login">If you have account login!</nuxt-link>
            <span>Don't worry dude, we don't have nonsensical privacy agreements like other sites because we are anonymous! We do not share your information with anyone.</span>
            <div class="err w-full" v-if="err">
                {{ err }}
            </div>
        </div>
    </form>
</template>
