<script setup>
import axios from 'axios';

definePageMeta({
    middleware: [
        'auth',
    ],
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

const page = ref(0);

const loadingNewMessages = ref(false);
const loadedMaxMessages = ref(false);

(async() => {
    if(!route.params.id || myUser.value.username == route.params.id) return router.push("/dashboard/friends");

    let {data} = await useFetch(`${apiUrl}/api/user/${route.params.id}`);

    if(!data.value.success) return router.push("/dashboard/friends");

    user.value = data.value.find;
})();

(async() => {
    let {data} = await useFetch(`${apiUrl}/api/user/${route.params.id}/messages`,{
        headers:{
            Authorization:token.value
        }
    });

    if(!data.value.success) return router.push("/dashboard/friends");

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
    
    let res = await axios.post(`${apiUrl}/api/user/${route.params.id}/messages/create`,{
        content:message.value
    },{
        headers:{
            Authorization:token.value
        }
    });

    let data = res.data;

    messages.value = [...messages.value,data.result];
    message.value = "";

    nextTick(() => {
        main.value.scrollTo({
            top: main.value.scrollHeight,
            left: 0,
        });
    });
};

const copyClipBoard = (text) => navigator.clipboard.writeText(text);

onMounted(() => {
    nextTick(() => {
        nextTick(() => {
            console.log("test");
            console.log(sock.value);

            main.value.scrollTo({
                top: main.value.scrollHeight,
                left: 0,
                behavior:"instant"
            });

            sock.value.removeAllListeners("message");

            sock.value.on('message',(t) => {
                console.log(t);
                if(t.channel == user.value.id){
                    messages.value.push(t.message);
                    nextTick(() => {
                        main.value.scrollTo({
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
    console.log(messages.value[0].id);
    if(main.value.scrollTop > 30 || loadingNewMessages.value || loadedMaxMessages.value) return;

    loadingNewMessages.value = true;

    let initialHeight = main.value.scrollHeight;
    
    page.value++;

    let {data} = await useFetch(`${apiUrl}/api/user/${route.params.id}/messages?page=${page.value}&cursor=${messages.value[0].id}`,{
        headers:{
            Authorization:token.value
        },
    });

    if(!data.value.success) return router.push("/dashboard/friends");

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
    <div class="w-full h-full flex flex-row items-center lg:justify-normal justify-center">
        <dashnav/>
        <div class="flex flex-col w-full lg:w-5/6 h-full p-4">
            <div v-if="user" class="flex flex-row items-center gap-3 bg-gray-800 p-2 rounded-full">
                <img class="rounded-full w-[32px] h-[32px]" draggable="false" width="32" height="32" :src="user.profilePhoto" alt="">
                <span>{{ user.username }}</span>
            </div>
            <div @scroll="scroll" ref="main" class="h-full overflow-y-auto">
                <div class="w-full flex items-center justify-center" v-if="loadingNewMessages">
                    <loading/>
                </div>
                <div class="w-full flex items-center justify-center p-4" v-if="loadedMaxMessages || messages.length < 1">
                    <span class="select-none text-gray-500 text-sm font-semibold">{{ route.params.id }} ile olan sohbetin başlangıcı..</span>
                </div>
                <div v-for="msg in messages" :key="msg.id" class="flex flex-col w-full hover:bg-gray-700 py-2 px-4">
                    <div class="flex flex-row w-full justify-between items-center relative">
                        <div class="flex flex-col items-start gap-2 w-full">
                            <div @click="openPopup(msg.from.id)" class="flex flex-row items-center gap-2 cursor-pointer">
                                <img class="w-[32px] h-[32px] rounded-full" alt="" draggable="false" :src="msg.from.profilePhoto" width="32">
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
    </div>
</template>