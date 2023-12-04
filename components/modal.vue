<script setup>
    const my = useState("user");

    const {user} = defineProps(['user']);

    const emit = defineEmits(['closeModal']);
    
    const closeModala = () => {
        emit("closeModal");
    };

    if(process.client){
        window.addEventListener('keydown',(e) => {
            if(e.key != "Escape") return;
            closeModala();
        });
    }
</script>

<template>
    <div @keydown="keydown" class="w-full h-full fixed bg-black bg-opacity-50 flex items-center justify-center z-50 top-0 left-0">
        <div class="bg-gray-800 flex flex-col w-full h-full lg:w-2/3 lg:h-2/3 p-4 rounded-lg">
            <div class="w-full flex flex-row items-center justify-between">
                <span>{{ user.username }}</span>
                <span class="py-2 px-4 bg-red-600 hover:bg-red-800 duration-300 rounded cursor-pointer" @click="closeModala">X</span>
            </div>
            <div class="w-full h-full flex flex-col items-center justify-center gap-5">
                <img :src="user.profilePhoto" width="64" class="rounded-full" draggable="false" alt="">
                <span>{{ user.username }}</span>
                <nuxt-link v-if="my && my.id != user.id" :to="`/dashboard/${user.username}/messages`" class="bg-gradient-to-tr from-purple-600 to-blue-800 py-2 px-4 rounded-full">Send message</nuxt-link>
            </div>
        </div>
    </div>
</template>