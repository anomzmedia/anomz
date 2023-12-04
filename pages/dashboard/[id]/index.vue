<script setup>
definePageMeta({
    middleware: [
        'auth',
    ],
});

const {public:{apiUrl}} = useRuntimeConfig();

const router = useRouter();
const route = useRoute();

const username = route.params.id;

const myUser = useState("user");
const user = ref(null);

(async() => {
    if(!username) return router.push("/dashboard/friends");

    if(myUser.value.username == username) return router.push("/dashboard/friends");

    let {data} = await useFetch(`${apiUrl}/api/user/${username}`);

    if(!data.value || !data.value.success) return router.push("/dashboard/friends");

    user.value = data.value.find;
})();

</script>

<template>
    <div class="w-full h-full flex flex-row items-center lg:justify-normal justify-center">
        <dashnav/>
        <div v-if="user" class="flex flex-col w-full lg:w-5/6 h-full items-center justify-center gap-5 p-4">
            <img draggable="false" :src="user.profilePhoto" class="rounded-full" width="64" alt="">
            <h1>{{username}}</h1>
            <nuxt-link :to="`/dashboard/${username}/messages`" class="bg-gradient-to-tr from-purple-600 to-blue-800 hover:scale-110 duration-300 py-2 px-4 rounded-full">Send message</nuxt-link>
        </div>
    </div>
</template>