<script setup>

    definePageMeta({
        middleware: [
            'auth',
        ],
    });

    const {public:{apiUrl}} = useRuntimeConfig();
    const token = useCookie("token");

    const myUser = useState("user");

    const group = ref(null);
    const messages = ref([]);

    const loading = ref(true);

    const route = useRoute();
    const id = ref(route?.params?.id);

    const message = ref("");

    const main = ref("");

    const modalActive = ref(false);
    const sock = useState("sock");

    (async() => {
        let res = await useFetch(`${apiUrl}/api/group/${id.value}`,{
            headers:{
                authorization:token.value
            }
        });

        group.value = res.data.value.find;
        
        loading.value = false;
    })();

    (async() => {
        let res = await useFetch(`${apiUrl}/api/group/${id.value}/messages`,{
            headers:{
                authorization:token.value
            }
        });

        messages.value = res.data.value.find.slice().reverse();;
        
        if(!process.client) return;

        nextTick(() => {
            main.value.scrollTo({
                top: main.value.scrollHeight,
                left: 0,
                behavior:"instant"
            });
        });
    })();

    const sendMessage = async() => {
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

        fetch(`${apiUrl}/api/group/${id.value}/messages/create`,{
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

    const loadingNewMessages = ref(false);
    const loadedMaxMessages = ref(false);

    const scroll = async() => {
        if(main.value.scrollTop > 100 || loadedMaxMessages.value || loadingNewMessages.value) return;
        
        loadingNewMessages.value = true;

        let initialHeight = main.value.scrollHeight;

        let res = await fetch(`${apiUrl}/api/group/${group.value.id}/messages?cursor=${messages.value[0].id}`,{
            headers:{
                Authorization:token.value
            }
        });
        let json = await res.json();

        if(json.find.length < 1) {
            loadingNewMessages.value = false;
            return loadedMaxMessages.value = true;
        }

        messages.value = [...json.find.slice().reverse(),...messages.value];

        nextTick(() => {
            main.value.scrollTo({
                top: main.value.scrollHeight-initialHeight,
                left: 0,
                behavior:"instant"
            });

            loadingNewMessages.value = false;
        });
    };

    onMounted(() => {
        nextTick(() => {
            sock.value.removeAllListeners("message");

            sock.value.on('message',(t) => {
                if(t.group && t.group == group.value.id){
                    messages.value.push(t.message);
                    nextTick(() => {
                        main.value.scrollTo({
                            top: main.value.scrollHeight,
                            left: 0,
                            behavior:"instant"
                        });
                    });
                };
            });
        }); 
    });
</script>

<template>
    <div class="w-full h-full flex flex-row items-center lg:justify-normal justify-center">
        <dashnav/>
        <div :class="`lg:w-5/6 w-full h-full flex flex-col items-center p-4`">
            <div v-if="group" :class="`w-full h-full fixed top-0 left-0 bg-black/30 z-50 flex items-center justify-center duration-300 ${modalActive ? 'opacity-100 visible' : 'opacity-0 invisible'}`">
                <div :class="`lg:w-2/3 lg:h-2/3 w-full h-full bg-gray-800 rounded-lg flex flex-col border-2 border-gray-700 duration-300 ${modalActive ? 'scale-100' : 'scale-0'}`">
                    <div class="flex flex-row items-center justify-between w-full p-4 border-b-2 border-gray-700">
                        <div class="flex flex-row items-center gap-3">
                            <img :src="group.profilePhoto" draggable="false" width="32" alt="">
                            <span>{{ group.name }}</span>
                        </div>
                        <button @click="modalActive = false;">X</button>
                    </div>
                    <div class="flex flex-col gap-3 overflow-auto p-4">
                        <span>Kullanıcılar</span>
                        <button v-for="user in group.users" :key="user.id" class="w-full gap-3 bg-gray-700 rounded-full flex flex-row items-center justify-between py-2 px-4">
                            <div class="flex flex-row items-center gap-3">
                                <img draggable="false" :src="user.profilePhoto" class="rounded-full" width="32" alt="">
                                <span>{{ user.username }}</span>
                            </div>
                            <i v-if="group.ownerId == user.id" class="fa-solid fa-chess-king text-yellow-600"></i>
                        </button>
                        <span></span>
                        <button class="w-full bg-gray-700 rounded-full flex flex-row items-center justify-between py-2 px-4">
                            <span>Add user</span>
                            <i class="fa-solid fa-user-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
            <button v-if="group" @click="modalActive = true;" class="flex flex-row items-center bg-gray-800 py-2 px-4 rounded-full w-full gap-3">
                <img width="32" height="32" draggable="false" class="rounded-full" :src="group.profilePhoto" alt="">
                <span>{{ group.name }}</span>
            </button>
            <div v-if="messages.length > 0" @scroll="scroll" ref="main" class="w-full h-full flex flex-col overflow-y-scroll">
                <div v-if="loadingNewMessages" class="w-full flex items-center justify-center">
                    <Loading/>
                </div>
                <div v-for="msg in messages" :key="msg.id" class="flex flex-col w-full hover:bg-gray-700 py-2 px-4 relative">
                    <div v-if="msg.loading" class="absolute w-full h-full bg-black/30 top-0 left-0 flex items-center justify-center">
                        <Loading/>
                    </div>
                    <div class="flex flex-row w-full justify-between items-center relative">
                        <div class="flex flex-col items-start gap-2 w-full">
                            <div v-if="msg.from && !msg.system" class="flex flex-row items-center gap-2 cursor-pointer">
                                <img class="w-[32px] h-[32px] rounded-full" alt="" draggable="false" :src="msg.from.profilePhoto" width="32">
                                <span>{{ msg.from.username }}</span>
                            </div>
                            <div v-else class="flex flex-row items-center gap-2 cursor-pointer">
                                <img class="w-[32px] h-[32px] rounded-full" alt="" draggable="false" src="/anomz2.png" width="32">
                                <span>System</span>
                            </div>
                            <span class="select-text whitespace-normal w-full max-w-full">{{ msg.content }}</span>
                        </div>
                        <div class="absolute right-0 flex flex-row items-center gap-2">
                            <!--<i :id="`msg_delete_btn_${msg?.id}`" v-if="msg?.from?.id == myUser.id" @click="deleteMessage(msg?.id)" class="fa-solid fa-trash hover:text-red-600 cursor-pointer duration-300 shake flex"></i>
                            <i @click="copyClipBoard(msg.content)" class="fa-solid fa-copy hover:text-blue-600 cursor-pointer duration-300"></i>-->
                        </div>
                    </div>
                </div>
            </div>
            <form @submit.prevent="sendMessage" class="w-full flex flex-row items-center rounded-full px-4 bg-gray-800">
                <input v-model="message" class="rounded-full w-full bg-transparent" placeholder="message" type="text">
                <button><i class="fa-solid fa-paper-plane"></i></button>
            </form>
        </div>
    </div>
</template>
