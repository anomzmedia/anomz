<script setup>
    import axios from "axios";

    definePageMeta({
        middleware: [
            'auth',
        ],
        layout:"dashboard"
    });

    const {public:{apiUrl}} = useRuntimeConfig();

    const route = useRoute();

    const myUser = useState("user");

    const post = ref(null);
    const newComment = ref("");
    const comments = ref([]);
    const modalActive = ref(false);
    const err = ref(null);

    const token = useCookie("token");

    (async() => {
        try {
            let {data} = await useFetch(`${apiUrl}/api/post/${route.params.id}`);

            if(!data.value.success) return err.value = data.value.message;

            post.value = data.value.find;
        } catch (error) {
        }
    })();

    (async() => {
        try {
            let {data} = await useFetch(`${apiUrl}/api/post/${route.params.id}/comments`);

            if(!data.value.success) return;

            comments.value = data.value.find;
        } catch (error) {
        }
    })();

    const submitComment = async() => {
        if(!newComment.value) return;
        
        axios.post(`${apiUrl}/api/post/${post.value.id}/comments/create`,{
            content:newComment.value
        },{
            headers:{
                Authorization:token.value
            }
        });

        comments.value.unshift({
            author:myUser.value,
            content:newComment.value
        })
        
        newComment.value = "";
    };

    const usrrnm = ref("");

</script>

<template>
    <div v-if="post" class="flex flex-col w-full h-full items-center gap-5 p-4">
        <!--<modal @close-modal="modalActive = false" :class="`duration-300 ${modalActive ? 'opacity-100 visible' : 'opacity-0 invisible'}`" :user="post.author"/>-->
        <UserModal @close-modal="modalActive = false" :username="usrrnm" :class="`duration-300 ${modalActive ? 'opacity-100 visible' : 'opacity-0 invisible'}`"/>
        <div @click="modalActive = true; usrrnm = post.author.username" class="w-full bg-gray-800 py-2 px-4 gap-3 rounded-lg flex flex-row items-center cursor-pointer">
            <Profile :src="post.author.profilePhoto" width="32" height="32"/>
            <span>{{ post.author.username }}</span>
        </div>
        <span class="w-full bg-gray-800 py-2 px-4 rounded-lg overflow-auto whitespace-pre-wrap h-1/2 select-text">
            {{ post.content }}
        </span>
        <div class="w-full flex flex-col items-center gap-2 overflow-auto h-1/2">
            <h1 class="text-xl uppercase">Comments</h1>
            <form @submit.prevent="submitComment" class="w-full flex flex-row items-center bg-gray-800 rounded-lg py-2 px-4">
                <textarea v-model="newComment" class="w-full bg-gray-800 focus:ring-0" placeholder="My comment is.." name="" id="" cols="30" rows="2"></textarea>
                <button type="submit"><i class="fa-solid fa-paper-plane cursor-pointer"></i></button>
            </form>
            <div class="w-full bg-gray-800 py-2 px-4 rounded-lg flex flex-col gap-2" v-for="comment in comments" :key="comment.id">
                <div @click="modalActive = true; usrrnm = comment.author.username" class="flex flex-row items-center gap-2 cursor-pointer">
                    <Profile :src="comment.author.profilePhoto" width="32" height="32"/>
                    <span>{{ comment.author.username }}</span>
                </div>
                <span>{{ comment.content }}</span>
            </div>
        </div>
    </div>
    <div v-else-if="err" class="w-full h-full lg:w-5/6 flex items-center justify-center p-6">
        <div class="w-full bg-red-200 text-red-600 rounded-full py-2 px-4">
            {{ err }}
        </div>
    </div>
    <div v-else class="flex w-full lg:w-5/6 h-full items-center justify-center">
        <Loading/>
    </div>
</template>
