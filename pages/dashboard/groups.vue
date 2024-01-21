<script setup>

    definePageMeta({
        middleware: [
            'auth',
        ],
    });

    const {public:{apiUrl}} = useRuntimeConfig();
    const token = useCookie("token");

    const user = useState("user");

    const page = ref(true);

    const changePage = () => page.value = !page.value;

    const name = ref("");
</script>

<template>
    <div class="w-full h-full flex flex-row items-center lg:justify-normal justify-center">
        <dashnav/>
        <div :class="`lg:w-5/6 w-full h-full flex flex-col items-center justify-center relative`" v-if="!page">
            <div class="w-full h-full flex flex-col items-center justify-center z-40 gap-3">
                <h1 class="text-4xl">Groups</h1>
                <span>Have fun conversations with your group of friends</span>
            </div>
            <img src="/group.jpg" class="w-full h-full absolute top-0 left-0 object-cover z-20" draggable="false" alt="">
            <div class="absolute w-full h-full bg-black/30 z-30 top-0 left-0"></div>
            <button @click="changePage" class="py-2 px-4 bg-green-600/80 hover:bg-green-800 rounded-full flex flex-row items-center gap-1 fixed z-50 bottom-5 right-5">
                <span>Create new group</span>
                <i class="fa-solid fa-right-long translate-y-[2px]"></i>
            </button>
        </div>
        <form :class="`lg:w-5/6 w-full h-full flex flex-col items-center justify-center gap-5 p-4`" v-else>
            <span class="text-2xl">Create New Group</span>
            <input class="lg" type="text" placeholder="name" v-model="name">
            <span class="text-xl">Group Users</span>
            <button type="button" class="py-2 px-4 bg-gray-800 hover:bg-gray-700 duration-300 rounded-full flex flex-row items-center gap-1">
                <span>Add User</span>
                <i class="fa-solid fa-user-plus"></i>
            </button>
            <div class="flex flex-col overflow-auto gap-3">
                <div v-for="i in [1,2,3,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]" class="flex flex-row items-center gap-1 bg-gray-800 hover:bg-gray-700 cursor-pointer duration-300 py-2 px-4 rounded-full">
                    <img :src="user.profilePhoto" width="32" height="32" class="rounded-full" alt="">
                    <span>{{ user.username }}</span>
                    <i class="fa-solid fa-user-minus"></i>
                </div>
            </div>
            <button class="py-2 px-4 border-2 hover:bg-white hover:text-black duration-300 rounded-full">Create Group</button>
        </form>
    </div>
</template>
