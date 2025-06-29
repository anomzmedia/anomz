<script setup>
    import axios from "axios";

    definePageMeta({
        middleware: [
            'auth',
        ],
        layout:"dashboard"
    });

    const posts = ref([]);
    const page = ref(0);
    const main = ref("");

    const loadingNewPosts = ref(false);
    const loadedMaxPosts = ref(false);

    const token = useCookie("token");

    const router = useRouter();

    const {public:{apiUrl}} = useRuntimeConfig();

    (async() => {
        let {data} = await useFetch(`${apiUrl}/api/post/all`);
        posts.value = data.value.posts;
    })();

    const postContent = ref("");

    const submitPost = async() => {
        let res = await axios.post(`${apiUrl}/api/post/create`,{
            content:postContent.value
        },{
            headers:{
                Authorization:token.value
            }
        });

        let data = res.data;

        posts.value.unshift(data.post);

        postContent.value = "";


        router.push(`/dashboard/post/${data.post.id}`);
    };

    const loadNewPosts = async() => {
        let {data} = await useFetch(`${apiUrl}/api/post/all?page=${page.value}&cursor=${posts.value[posts.value.length-1].id}`);
        if(data.value.posts.length < 1) loadedMaxPosts.value = true;
        posts.value = [...posts.value,...data.value.posts];
    };

    const scroll = async() => {
        if(Math.abs(main.value.scrollHeight-(main.value.scrollTop+main.value.clientHeight)) > 100 || loadingNewPosts.value || loadedMaxPosts.value) return;
        loadingNewPosts.value = true;
        page.value++;
        await loadNewPosts();
        loadingNewPosts.value = false;
    };

    const modalActive = ref(false);
    const usrnm = ref("");
</script>

<template>
    <UserModal :username="usrnm" v-if="modalActive" @close-modal="modalActive = !modalActive;"/>
    <div ref="main" @scroll="scroll" class="w-full h-full flex flex-col items-center gap-5 p-4 overflow-y-scroll">
        <img width="128" draggable="false" class="duration-300 rounded-full" height="128" src="/anomz2.png" alt="">
        <div class="flex flex-col lg:flex-row items-center gap-5 w-full">
            <button v-for="num in [1,2,3]" :key="num" class="w-full lg:w-1/3 flex flex-col items-center focus:ring bg-gray-800 hover:bg-gray-700 cursor-pointer transition-all duration-300 py-2 px-4 rounded-lg gap-1">
                <i class="fa-solid fa-user-group fa-2x"></i>
                <span>Friend requests</span>
                <span class="text-2xl font-bold text-transparent bg-gradient-to-tr from-purple-600 to-blue-600 bg-clip-text">10</span>
            </button>
        </div>
        <div class="w-full flex flex-col gap-3">
            <form @submit.prevent="submitPost" class="w-full flex flex-row items-center bg-gray-800 rounded-lg py-2 px-4">
                <textarea v-model="postContent" class="w-full bg-gray-800 focus:ring-0" placeholder="The weather is very nice today!" name="" id="" cols="30" maxlength="1024" :rows="postContent.split('\n').length"></textarea>
                <button type="submit"><i class="fa-solid fa-paper-plane cursor-pointer"></i></button>
            </form>
            <span>{{ postContent.length }}/1024</span>
            <span class="w-full h-[1px] bg-gray-800 block">
                <span :style="`width: ${(postContent.length/1024)*100}%;`" :class="`duration-300 h-[1px] bg-gray-600 block`"></span>
            </span>
        </div>
        <span class="text-xl uppercase">latest posts</span>
        <div v-if="posts.length < 1" class="w-full flex items-center justify-center">
            <loading/>
        </div>
        <div v-else v-for="post in posts" :key="post.id" class="py-2 px-4 w-full bg-gray-800 rounded-lg flex flex-col gap-3">
            <div @click="modalActive = true; usrnm = post.author.username" class="w-auto flex flex-row gap-2 items-center cursor-pointer">
                <div class="relative z-10">
                    <Profile :src="post.author.profilePhoto" width="32" height="32"/>
                    <span class="border-2 border-green-600 text-green-600 bg-green-600 w-3 h-3 block rounded-full absolute right-[-2px] bottom-[-2px]"></span>
                </div>
                <span>{{post.author.username}}</span>
            </div>
            <nuxt-link :to="`/dashboard/post/${post.id}`" class="w-full flex flex-col overflow-auto">
                <span class="select-text whitespace-pre-wrap">{{ post.content.slice(0,128) }}</span>
                <span class="text-blue-600 underline">read more</span>
            </nuxt-link>
        </div>
        <div v-if="loadingNewPosts" class="flex items-center justify-center w-full">
            <Loading/>
        </div>
        <div v-if="loadedMaxPosts" class="w-full flex items-center justify-center select-none">
            <span class="text-gray-500 z-20">Dostum o kadar çok kaydırdın ki katman kayasına ulaştın. 😐</span>
        </div>
    </div>
</template>
