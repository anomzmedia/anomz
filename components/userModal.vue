<script setup>

const {public:{apiUrl}} = useRuntimeConfig();

const props = defineProps({
    username:{default:"",type:[String]}
});

const emit = defineEmits(['closeModal']);

const user = ref(null);

watch(() => props.username,() => {
    user.value = null;

    get();
});

const get = async() => {
    if(!props.username) return;

    let {data} = await useFetch(`${apiUrl}/api/user/${props.username}`);

    if(!data.value || !data.value.find) return;

    user.value = data.value.find;
};

get();
</script>

<template>
    <div class="w-full h-full bg-black/30 fixed top-0 left-0 flex items-center justify-center z-50">
        <div class="lg:w-2/3 lg:h-2/3 h-full w-full bg-gray-800 rounded-lg flex flex-col border-2 border-gray-700">
            <div class="w-full flex flex-row items-center justify-between border-b-2 border-gray-700 py-2 px-4">
                <span>{{ props.username }}</span>
                <button @click="emit('closeModal')">X</button>
            </div>
            <div v-if="user" class="overflow-auto w-full h-full flex flex-col items-center gap-3 py-2">
                <div class="relative">
                    <img draggable="false" :src="user.profilePhoto" width="64" height="64" class="rounded-full" alt="">
                    <span v-if="user.active" class="absolute bottom-0 right-0 block w-[10px] h-[10px] border-[3px] border-green-600 rounded-full"></span>
                    <span v-else class="absolute bottom-0 right-0 block w-[10px] h-[10px] border-[3px] border-gray-600 rounded-full"></span>
                </div>
                <span>{{ user.username }}</span>
                <nuxt-link :to="`/dashboard/${user.username}`" class="bg-gradient-to-tr from-purple-600 to-blue-800 py-2 px-4 rounded-full">Send Message</nuxt-link>
                <span>Takipçi 0</span>
            </div>
            <div v-else class="w-full h-full flex items-center justify-center">
                <Loading/>
            </div>
        </div>
    </div>
</template>