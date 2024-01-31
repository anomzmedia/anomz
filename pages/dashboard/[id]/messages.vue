<script setup>
import axios from 'axios';

definePageMeta({
    middleware: [
        'auth',
    ],
    layout:"dashboard"
});

const {public:{apiUrl}} = useRuntimeConfig();

const router = useRouter();
const route = useRoute();

const myUser = useState("user");
const token = useCookie("token");

const sock = useState("sock");

const user = ref(null);

const message = ref("");
const messages = ref([]);

const main = ref("");

const loadingNewMessages = ref(false);
const loadedMaxMessages = ref(false);

(async() => {
    if(!route.params.id || myUser.value.username == route.params.id) return router.push("/dashboard/");

    let {data} = await useFetch(`${apiUrl}/api/user/${route.params.id}`);

    if(!data.value.success) return router.push("/dashboard/");

    user.value = data.value.find;
})();

(async() => {
    let {data} = await useFetch(`${apiUrl}/api/user/${route.params.id}/messages`,{
        headers:{
            Authorization:token.value
        }
    });

    if(!data.value.success) return router.push("/dashboard/");

    messages.value = data.value.messages.slice().reverse();

    if(!process.client) return;

    nextTick(() => {
        main.value.scrollTo({
            top: main.value.scrollHeight,
            left: 0,
            behavior:"instant"
        });
    });
})();

const submit = async() => {
    if(!message.value) return;
        
    let fakeId = Math.random()*Date.now();

    messages.value.push({
        content:message.value,
        from:myUser.value,
        loading:true,
        fakeId
    });

    nextTick(() => {
        main.value.scrollTo({
            top: main.value.scrollHeight,
            left: 0,
            behavior:"instant"
        });
    });

    fetch(`${apiUrl}/api/user/${route.params.id}/messages/create`,{
        method:"POST",
        body:JSON.stringify({
            content:message.value
        }),
        headers:{
            Authorization:token.value,
            'Content-Type':'application/json'
        }
    }).then(() => {
        messages.value.find((e) => e?.fakeId == fakeId).loading = false;
    });

    message.value = "";
};

const copyClipBoard = (text) => navigator.clipboard.writeText(text);

onMounted(() => {
    nextTick(() => {
        nextTick(() => {
            main.value.scrollTo({
                top: main.value.scrollHeight,
                left: 0,
                behavior:"instant"
            });

            sock.value.removeAllListeners("message");

            sock.value.on('message',(t) => {
                console.log(t);
                if(t.channel && t.channel == user.value.id){
                    messages.value.push(t.message);
                    nextTick(() => {
                        main?.value?.scrollTo({
                            top: main.value.scrollHeight,
                            left: 0,
                        });
                    });
                };
            });            
        });
    });
});

const scroll = async() => {
    if(main.value.scrollTop > 30 || loadingNewMessages.value || loadedMaxMessages.value) return;

    loadingNewMessages.value = true;

    let initialHeight = main.value.scrollHeight;
    
    let {data} = await useFetch(`${apiUrl}/api/user/${route.params.id}/messages?cursor=${messages.value[0].id}`,{
        headers:{
            Authorization:token.value
        },
    });

    if(!data.value.success) return router.push("/dashboard/");

    messages.value = [...data.value.messages.slice().reverse(),...messages.value];

    nextTick(() => {
        main.value.scrollTo({
            top: main.value.scrollHeight-initialHeight,
            left: 0,
            behavior:"instant"
        });

        loadingNewMessages.value = false;
    });

    if(data.value.messages.length < 1) loadedMaxMessages.value = true;
};

const openPopup = (id) => {

};

const deleteMessage = (id) => {

};

</script>

<template>
    <div class="flex flex-col w-full h-full p-4">
        <div v-if="user" class="flex flex-row items-center gap-3 bg-gray-800 p-2 rounded-full">
            <Profile :src="user.profilePhoto" width="32" height="32"/>
            <span>{{ user.username }}</span>
            <nuxt-link :to="`/dashboard/${user.username}/voice`">make call</nuxt-link>
        </div>
        <div @scroll="scroll" ref="main" class="h-full overflow-y-auto">
            <div class="w-full flex items-center justify-center" v-if="loadingNewMessages">
                <loading/>
            </div>
            <div class="w-full flex items-center justify-center p-4" v-if="loadedMaxMessages || messages.length < 1">
                <span class="select-none text-gray-500 text-sm font-semibold">{{ route.params.id }} ile olan sohbetin başlangıcı..</span>
            </div>
            <div v-for="msg in messages" :key="msg.id" class="flex flex-col w-full hover:bg-gray-700 py-2 px-4 relative">
                <div v-if="msg.loading" class="absolute w-full h-full bg-black/30 top-0 left-0 flex items-center justify-center">
                    <Loading/>
                </div>
                <div class="flex flex-row w-full justify-between items-center relative">
                    <div class="flex flex-col items-start gap-2 w-full">
                        <div @click="openPopup(msg.from.id)" class="flex flex-row items-center gap-2 cursor-pointer">
                            <Profile :src="msg.from.profilePhoto" width="32" height="32"/>
                            <span>{{ msg.from.username }}</span>
                        </div>
                        <span class="select-text whitespace-normal w-full max-w-full">{{ msg.content }}</span>
                    </div>
                    <div class="absolute right-0 flex flex-row items-center gap-2">
                        <i :id="`msg_delete_btn_${msg?.id}`" v-if="msg?.from?.id == myUser.id" @click="deleteMessage(msg?.id)" class="fa-solid fa-trash hover:text-red-600 cursor-pointer duration-300 shake flex"></i>
                        <i @click="copyClipBoard(msg.content)" class="fa-solid fa-copy hover:text-blue-600 cursor-pointer duration-300"></i>
                    </div>
                </div>
            </div>
        </div>
        <form @submit.prevent="submit" class="w-full flex flex-row items-center bg-gray-800 rounded-full pr-4 pl-2">
            <input placeholder="my message" v-model="message" class="w-full rounded-full focus:ring-0 bg-gray-800" type="text">
            <div class="flex gap-5 flex-row items-center">
                <button type="submit"><i class="fa-solid fa-paperclip text-gray-300"></i></button>
                <button type="submit"><i class="fa-solid fa-paper-plane text-gray-300"></i></button>
            </div>
        </form>
    </div>
</template>