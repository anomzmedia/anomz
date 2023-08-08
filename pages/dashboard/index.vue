<script setup>
    import useAPI from "~/composables/axios";
    import { sendNotification } from "~/composables/notification";
    import { vAutoAnimate } from "@formkit/auto-animate";

    definePageMeta({
        middleware: [
            'auth',
        ],
    });

    let page = ref(0);

    const axios = useAPI();

    const loadedMaxPost = ref(false);

    var posts = ref([]);
    var postContent = ref("");

    let loadingNewPosts = ref(false);

    (async() => {
        let {data:{find}} = await axios.get("/api/post/all");

        posts.value = find;
    })();

    const loadPosts = async() => {
        if(loadedMaxPost.value) return;

        let {data:{find}} = await axios.get(`/api/post/all?page=${page.value}`);

        if(find.length <= 0) return loadedMaxPost.value = true;
        
        for(const po of find){
            posts.value.push(po);
        };
    };

    const submitPost = async() => {
        if(!postContent.value) return;

        try {
            let {data} = await axios.post('/api/post/create',{
                content:postContent.value,
                attachments:[]
            });

            if(!data.success) return sendNotification(data.message);

            posts.value.unshift(data.post);
            //posts.value.pop();
        } catch (error) {
            sendNotification(error.message);
        }

        postContent.value = "";
    };

    window.onscroll = async () => {
        if(loadingNewPosts.value) return;
        
        let height = Math.floor(document.documentElement.scrollHeight);
        let bottomOfWindow = Math.floor(document.documentElement.scrollTop + window.innerHeight);

        if(bottomOfWindow > height-100){
            loadingNewPosts.value = true;
            page.value++;
            await loadPosts();
            loadingNewPosts.value = false;
        }
    };
</script>

<template>
    <div class="w-full h-full flex flex-row items-center lg:justify-normal justify-center">
        <dashnav/>
        <div class="w-full h-full flex flex-col items-end">
            <div class="flex flex-col w-full lg:w-5/6 min-h-full items-center gap-5 p-4" v-auto-animate>
                <img width="128" draggable="false" class="hover:rotate-180 duration-300 rounded-full" height="128" src="/favicon.svg" alt="">
                <div class="flex flex-col lg:flex-row items-center gap-5 w-full">
                    <button v-for="num in [1,2,3]" :key="num" class="w-full lg:w-1/3 flex flex-col items-center focus:ring bg-gray-800 hover:bg-gray-700 cursor-pointer transition-all duration-300 py-2 px-4 rounded-lg gap-1">
                        <i class="fa-solid fa-user-group fa-2x"></i>
                        <span>Friend requests</span>
                        <span class="text-2xl font-bold text-transparent bg-gradient-to-tr from-purple-600 to-blue-600 bg-clip-text">10</span>
                    </button>
                </div>
                <form @submit.prevent="submitPost" class="w-full flex flex-row items-center bg-gray-800 rounded-lg py-2 px-4">
                    <textarea v-model="postContent" class="w-full bg-gray-800 focus:ring-0" placeholder="The weather is very nice today!" name="" id="" cols="30" rows="2"></textarea>
                    <button type="submit"><i class="fa-solid fa-paper-plane cursor-pointer"></i></button>
                </form>
                <span class="text-xl uppercase">latest posts</span>
                <div v-if="posts.length < 1" class="w-full flex items-center justify-center">
                    <loading/>
                </div>
                <div v-else v-for="post in posts" :key="post._id" class="py-2 px-4 w-full bg-gray-800 rounded-lg flex flex-col gap-3">
                    <modal @close-modal="post.author.modalActive = false;" :class="`${post.author.modalActive ? 'opacity-100 visible' : 'opacity-0 invisible'} duration-300`" :user="post.author" />
                    <div @click="post.author.modalActive = true" class="w-auto flex flex-row gap-2 items-center cursor-pointer">
                        <div class="relative">
                            <img draggable="false" :src="post.author.profilePhoto" class="rounded-full" width="32" alt="">
                            <span class="border-2 border-green-600 text-green-600 bg-green-600 w-3 h-3 block rounded-full absolute right-[-2px] bottom-[-2px]"></span>
                        </div>
                        <span>{{post.author.id}}</span>
                    </div>
                    <nuxt-link :to="`/dashboard/post/${post._id}`" class="w-full flex flex-col overflow-auto">
                        <span class="select-text whitespace-pre-wrap">{{ post.content.slice(0,128) }}</span>
                        <span class="text-blue-600 underline" v-if="post.content.length > 128">read more</span>
                    </nuxt-link>
                </div>
                <div class="flex items-center justify-center w-full">
                    <loading v-if="loadingNewPosts"/>
                </div>
                <div v-if="loadedMaxPost" class="w-full flex flex-col text-gray-500 items-center justify-center">
                    <span>Dostum o kadar çok kaydırdın ki katman kayasına ulaştın. 😐</span>
                    <!--<span>- arasemr12 (ANOMZ CEO)</span>-->
                </div>
            </div>
        </div>
    </div>
</template>
