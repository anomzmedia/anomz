<script setup>

    definePageMeta({
        middleware: [
            'auth',
        ],
    });

    const user = useState("user");
    const username = ref("");

    const users = ref([]);

    const error = ref("");

    const router = useRouter();

    const {public:{apiUrl}} = useRuntimeConfig();
    const token = useCookie("token");

    const loading = ref(true);

    const send = () => {
        error.value = "";
        if(user.value.username == username.value) return error.value = "Choose another user than yourself!";
        router.push(`/dashboard/${username.value}`);
    };

    (async() => {
        let {data} = await useFetch(`${apiUrl}/api/user/`,{
            headers:{
                Authorization:token.value
            }
        });

        users.value = data.value.find;
        
        loading.value = false;
    })();
</script>

<template>
    <div class="w-full h-full flex flex-row items-center lg:justify-normal justify-center">
        <dashnav/>
        <div class="flex flex-col w-full lg:w-5/6 h-full items-center gap-5 p-4">
            <form @submit.prevent="send" class="flex flex-col w-full gap-5">
                <label for="id">Add a friend</label>
                <div class="flex flex-row items-center w-full whitespace-nowrap gap-1 bg-gray-700 rounded-full px-4 py-1">
                    <input v-model="username" id="id" autocomplete="off" class="w-full rounded-none focus:ring-0" type="text" placeholder="username">
                    <button type="submit" class="">
                        <i class="fa-solid fa-plus fa-2x text-gray-400 hover:text-white hover:rotate-90 duration-300"></i>
                    </button>
                </div>
            </form>
            <div :class="`bg-red-100 text-red-600 w-full rounded-full py-2 px-4 duration-300 ${error ? 'opacity-100 visible' : 'opacity-0 invisible'}`">
                {{ error }}
            </div>
            <div class="w-full flex flex-col gap-2 overflow-auto">
                <nuxt-link v-for="user in users" :key="user.id" :to="`/dashboard/${user.username}`" class="bg-gray-800 hover:bg-gray-700 cursor-pointer duration-300 rounded-full px-4 py-2 flex flex-row justify-between items-center">
                    <div class="flex flex-row items-center gap-2">
                        <img :src="user.profilePhoto" width="32" height="32" class="rounded-full" alt="">
                        <span>{{user.username}}</span>
                    </div>
                    <div>
                        <i class="fa-solid fa-message"></i>
                    </div>
                </nuxt-link>
                <div class="w-full flex items-center justify-center">
                    <Loading v-if="loading"/>
                </div>
            </div>
        </div>
    </div>
</template>
