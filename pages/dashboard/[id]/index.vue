<script setup>
import useAPI from '../../../composables/axios';

definePageMeta({
    middleware: [
        'auth',
    ],
});

const loading = ref(true);

const myUser = useState("user");

const route = useRoute();
const id = route.params.id;
const user = ref(null);

(async() => {
    const router = useRouter();

    if(!id) return router.push("/");

    if(myUser.value.id == id) return router.push("/dashboard/friends");

    const axios = useAPI();
    
    let res = await axios.get(`/api/user/${id}`);
    let data = res.data;

    if(!data.success) return router.push("/");

    user.value = data.user;

    loading.value = false;
})();

</script>

<template>
    <div class="w-full h-full flex flex-row items-center lg:justify-normal justify-center">
        <dashnav/>
        <loadingAn v-if="loading"/>
        <div class="w-full h-full flex flex-col items-end" v-else>
            <div class="flex flex-col w-full lg:w-5/6 h-full items-center justify-center gap-5 p-4">
                <img draggable="false" :src="user.profilePhoto" class="rounded-full" width="64" alt="">
                <h1>{{id}}</h1>
                <nuxt-link :to="`/dashboard/${id}/messages`" class="bg-gradient-to-tr from-purple-600 to-blue-800 py-2 px-4 rounded-full">Send message</nuxt-link>
            </div>
        </div>
    </div>
</template>