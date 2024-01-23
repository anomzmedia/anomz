<script setup>

    definePageMeta({
        middleware: [
            'auth',
        ],
    });

    const {public:{apiUrl}} = useRuntimeConfig();
    const token = useCookie("token");

    const user = useState("user");

    const groups = ref([]);
    const loading = ref(true);

    (async() => {
        let res = await useFetch(`${apiUrl}/api/group/all`,{
            headers:{
                authorization:token.value
            }
        });

        groups.value = res.data.value.find;
    
        loading.value = false;
    })();
</script>

<template>
    <div class="w-full h-full flex flex-row items-center lg:justify-normal justify-center">
        <dashnav/>
        <div :class="`lg:w-5/6 w-full h-full flex flex-col items-center gap-3 overflow-auto p-4`">
            <span class="text-xl">Groups</span>
            <div class="w-full flex items-center justify-center" v-if="loading">
                <Loading/>
            </div>
            <nuxt-link v-for="group in groups" :key="group.id" :to="`/dashboard/groups/${group.id}`" class="w-full flex flex-row gap-3 items-center bg-gray-800 hover:bg-gray-700 duration-300 rounded-full py-2 px-4">
                <img src="/anomz2.png" width="32" alt="">
                <span>{{ group.name }}</span>
            </nuxt-link>
            <nuxt-link to="/dashboard/groups/create" class="flex flex-row items-center justify-between w-full bg-gray-800 hover:bg-gray-700 duration-300 rounded-full py-2 px-4">
                <span>Create group</span>
                <i class="fa-solid fa-plus"></i>
            </nuxt-link>
        </div>
    </div>
</template>
