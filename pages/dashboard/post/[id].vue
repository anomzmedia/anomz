<script setup>
    import useAPI from '~/composables/axios';
    import { vAutoAnimate } from '@formkit/auto-animate';

    const axios = useAPI();

    definePageMeta({
        middleware: [
            'auth',
        ],
    });

    const route = useRoute();

    const postid = route.params.id;

    const myUser = useState("user");

    const post = ref(null);
    const newComment = ref("");
    const comments = ref([]);
    const modalActive = ref(false);
    const err = ref(null);

    (async() => {
        try {
            let res = await axios.get(`/api/post/${postid}`);
            let data = res.data;

            if(!data.success) return err.value = data.message;

            post.value = data.post;
            comments.value = data.comments;
        } catch (error) {
            err.value = error.message;
        }
    })();

    const submitComment = async() => {
        if(!newComment.value) return;
        
        axios.post(`/api/post/${post.value._id}/comments/create`,{
            content:newComment.value
        });

        comments.value.unshift({
            author:myUser.value,
            content:newComment.value
        })
        
        newComment.value = "";
    };

</script>

<template>
    <div class="w-full h-full flex flex-row items-center lg:justify-normal justify-center">
        <dashnav/>
        <div class="w-full h-full flex flex-col items-end">
            <div v-if="err" class="flex flex-col gap-5 w-full lg:w-5/6 h-full items-center justify-center">
                <span class="py-2 px-4 bg-red-100 text-red-600 rounded-full">
                    {{ err }}
                </span>
                <nuxt-link class="grbtn" to="/dashboard/">Go back to home</nuxt-link>
            </div>
            <div v-else-if="post" class="flex flex-col w-full lg:w-5/6 h-full items-center gap-5 p-4">
                <modal @close-modal="modalActive = false" :class="`duration-300 ${modalActive ? 'opacity-100 visible' : 'opacity-0 invisible'}`" :user="post.author"/>
                <div @click="modalActive = true" class="w-full bg-gray-800 py-2 px-4 gap-3 rounded-lg flex flex-row items-center cursor-pointer">
                    <img :src="post.author.profilePhoto" width="32" height="32" class="rounded-full" draggable="false" alt="">
                    <span>{{ post.author.username }}</span>
                </div>
                <span class="w-full bg-gray-800 py-2 px-4 rounded-lg overflow-auto whitespace-pre-wrap h-1/2 select-text">
                    {{ post.content }}
                </span>
                <div class="w-full flex flex-col items-center gap-2 overflow-auto h-1/2" v-auto-animate>
                    <h1 class="text-xl uppercase">Comments</h1>
                    <form @submit.prevent="submitComment" class="w-full flex flex-row items-center bg-gray-800 rounded-lg py-2 px-4">
                        <textarea v-model="newComment" class="w-full bg-gray-800 focus:ring-0" placeholder="My comment is.." name="" id="" cols="30" rows="2"></textarea>
                        <button type="submit"><i class="fa-solid fa-paper-plane cursor-pointer"></i></button>
                    </form>
                    <div class="w-full bg-gray-800 py-2 px-4 rounded-lg flex flex-col gap-2" v-for="comment in comments" :key="comment.id">
                        <div @click="comment.author.modal = true" class="flex flex-row items-center gap-2">
                            <img :src="comment.author.profilePhoto" class="rounded-full" width="32" height="32" alt="">
                            <span>{{ comment.author.username }}</span>
                        </div>
                        <modal :user="comment.author" :class="`duration-300 ${comment.author.modal ? 'opacity-100 visible' : 'opacity-0 invisible'}`" @close-modal="comment.author.modal = false"/>
                        {{ comment.content }}
                    </div>
                </div>
            </div>
            <div v-else class="flex w-full lg:w-5/6 h-full items-center justify-center">
                <loading/>
            </div>
        </div>
    </div>
</template>
