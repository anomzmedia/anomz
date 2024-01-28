<script setup>
definePageMeta({
    middleware: [
        'auth',
    ],
    layout:"dashboard"
});

const {public:{apiUrl}} = useRuntimeConfig();

const router = useRouter();
const route = useRoute();

const username = ref(route?.params?.id);

const myUser = useState("user");
const user = ref(null);

const token = useCookie("token");

(async() => {
    if(!username.value || myUser.value.username == username.value) return router.push("/dashboard/");

    let {data} = await useFetch(`${apiUrl}/api/user/${username.value}`,{
        headers:{
            Authorization:token.value
        }
    });

    if(!data.value || !data.value.success) return router.push("/dashboard/");

    user.value = data.value.find;
})();

</script>

<template>
    <div v-if="user" class="w-full h-full flex flex-col items-center justify-center gap-5">
        <img draggable="false" :src="user.profilePhoto" class="rounded-full" width="64" alt="">
        <h1>{{username}}</h1>
        <nuxt-link :to="`/dashboard/${username}/messages`" class="bg-gradient-to-tr from-purple-600 to-blue-800 hover:scale-110 duration-300 py-2 px-4 rounded-full">Send message</nuxt-link>
    </div>
</template>