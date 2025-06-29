<script setup>

const {active,close} = defineProps(["active","close"]);

const {public:{apiUrl}} = useRuntimeConfig();

const searchUsername = ref("");
const searchFind = ref(null);
const searchLoading = ref(false);

watch(searchUsername,async(val,oldVal) => {
    if(!val) return searchFind.value = null;
    searchLoading.value = true;

    let {data} = await useFetch(`${apiUrl}/api/user/${val}`);
    
    searchLoading.value = false;

    if(!data?.value?.find) return;

    searchFind.value = data?.value?.find;
});

</script>

<template>
    <div :class="`w-full h-full fixed top-0 left-0 bg-black/30 z-50 flex items-center justify-center duration-300 ${active ? 'opacity-100 visible' : 'opacity-0 invisible'}`">
        <div :class="`lg:w-2/3 lg:h-2/3 w-full h-full bg-gray-800 rounded-lg flex flex-col border-2 border-gray-700 duration-300 ${active ? 'scale-100' : 'scale-0'}`">
            <div class="w-full py-2 px-4 flex flex-row items-center justify-between border-b-2 border-gray-700">
                <span>Search</span>
                <button @click="close">X</button>
            </div>
            <div class="h-full flex flex-col items-center justify-center overflow-auto py-2 px-4 gap-5">
                <input v-model="searchUsername" class="w-full rounded-full" type="text" placeholder="username">
                <div v-if="searchLoading" class="w-full flex items-center justify-center">
                    <Loading/>
                </div>
                <nuxt-link v-else-if="searchFind" @click="searchModal = false" :to="`/dashboard/${searchFind.username}`" class="flex flex-row items-center gap-3 bg-gray-700 rounded-full py-2 px-4">
                    <Profile :src="searchFind.profilePhoto" width="32" height="32"/>
                    <span>{{ searchFind.username }}</span>
                </nuxt-link>
                <div v-else class="flex items-center justify-center w-full">
                    <span class="text-gray-400 select-none">User not found.. 🙁</span>
                </div>
            </div>
        </div>
    </div>
</template>
