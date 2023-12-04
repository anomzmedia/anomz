<script setup>
    import axios from "axios";

    definePageMeta({
        middleware: [
            'auth',
        ],
    });

    const token = useCookie("token");
    const user = useState("user");

    const noteModal = ref(false);

    const text = ref(user.value.noteText);
    const track_id = ref(user.value.noteTrackId);

    const {public:{apiUrl}} = useRuntimeConfig();

    const saveNote = async() => {
        axios.post(`${apiUrl}/api/user/me/note/edit`,{
            text:text.value,
            track_id:track_id.value
        },{
            headers:{
                Authorization:token.value
            }
        });

        user.value.noteText = text.value;
        user.value.noteTrackId = track_id.value;
        user.value.noteEndDate = Date.now()+24*60*60*1000;
    };
</script>

<template>
    <div v-if="user" class="w-full h-full flex flex-row items-center">
        <dashnav/>
        <div class="flex flex-col w-full lg:w-5/6 h-full items-center justify-center gap-y-5 p-4 overflow-auto">
            <img :src="user.profilePhoto" class="rounded-full" width="64" height="64" draggable="false" alt="">
            <span class="text-2xl">{{ user.username }}</span>
            <span class="text-xl" v-if="Date.now() < new Date(user.noteEndDate).getTime() && user.noteText">{{ user.noteText }}</span>
            <audio v-if="Date.now() < new Date(user.noteEndDate).getTime() && user.noteTrackId" :src="`${apiUrl}/api/track/${user.noteTrackId}`" controls></audio>
            <button @click="noteModal = !noteModal" class="py-2 px-4 rounded-full bg-gray-800 hover:bg-gray-700 duration-300 flex items-center">{{ Date.now() < new Date(user.noteEndDate).getTime() && user.noteText ? 'Edit' : 'Add a' }} note<i class="fa-solid fa-plus ml-2"></i></button>
        </div>
    </div>
    <div v-if="noteModal" class="rounded-lg lg:w-3/4 lg:h-3/4 w-full h-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 z-50 flex flex-col items-center">
        <div class="w-full flex flex-row items-center justify-between p-4">
            <span>Note</span>
            <span @click="noteModal = !noteModal" class="py-2 px-4 bg-red-600 hover:bg-red-800 cursor-pointer rounded">X</span>
        </div>
        <div class="flex flex-col w-full h-full p-6 gap-5 items-center justify-center">
            <input v-model="text" class="bg-gray-800 w-full" type="text" placeholder="Text..">
            <input v-model="track_id" class="bg-gray-800 w-full" type="text" placeholder="Spotify track id">
            <button @click="saveNote" class="purple_rounded_btn">Save note</button>
        </div>
    </div>
</template>
