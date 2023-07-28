<script setup>
import useAPI from '../../../composables/axios';
import {vAutoAnimate} from "@formkit/auto-animate";

definePageMeta({
    middleware: [
        'auth',
    ],
});

const regex = /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g;

const axios = useAPI();

const route = useRoute();

const username = route.params.id;
const myUser = useState("user");

const loadingPage = ref(true);
const message = ref("");
const loadingNewMessages = ref(false);

const user = ref(null);
const msgs = ref(null);

const messages = ref([]);

const socket = useState("socket");

const page = ref(0);
const loadedMaxMessage = ref(false);

const loadNewMessages = async() => {
    if(loadedMaxMessage.value) return;

    let res = await axios.get(`/api/user/${username}/messages?page=${page.value}`);
    let data = res.data;

    if(data.messages.length < 1) return loadedMaxMessage.value = true;

    data.messages.reverse().forEach((msg) => {
        msg.ogp = [];
        messages.value.unshift(msg);
    });
};

socket.value.addEventListener("message",(data) => {
    data = JSON.parse(data.data);
    if(data.action == "message"){
        messages.value.push(JSON.parse(data.value));
        nextTick(() => {
            msgs.value.scrollTo(0, msgs.value.scrollHeight);
        });
    }

    if(data.action == "messageDelete"){
        let ms = JSON.parse(data.value);
        messages.value = messages.value.filter((msg) => msg._id != ms._id);
    }
});

const loadMessageOgpTags = () => new Promise((resolve,reject) => {
    messages.value.forEach(async(msg,i) => {
        msg.ogp = [];
        let matchs = messageGetLinks(msg.content);
        //if(matchs.length > 0) msg.content = msg.content.replace(regex,"<a class=\"link\" href=\"$1\">$1</a>")
        matchs.forEach(async(link,b) => {
            try {
                let res = await axios.get(`https://opengraph.io/api/1.1/site/${encodeURIComponent(link)}?app_id=63c08b2c-2fa6-431c-846a-9901e96d0d71`);
                let data = res.data;

                msg.ogp.push(data.hybridGraph);
            } catch (error) {
                
            }
        });

        if(messages.value.length-1 == i) resolve();
    });
});

onMounted(async() => {
    console.log(msgs.value);
    
    const router = useRouter();

    if(!username) return router.push("/");

    if(myUser.value.username == username) router.push("/");
    
    let res = await axios.get(`/api/user/${username}/messages`);
    let data = res.data;

    if(!data.success) return router.push("/");

    user.value = data.user;
    messages.value = data.messages;

    loadingPage.value = false;

    nextTick(() => {
        //msgs.value.scrollTo(0, msgs.value.scrollHeight);
        msgs.value.scrollTop = msgs.value.scrollHeight;
    });

    await loadMessageOgpTags();

    nextTick(() => {
        //msgs.value.scrollTo(0, msgs.value.scrollHeight);
        msgs.value.scrollTop = msgs.value.scrollHeight;
    });
});

const send = async () => {
    if(!message.value) return;

    let res = await axios.post(`/api/user/${username}/messages/create`,{
        content:message.value
    });

    let data = res.data;

    data.newMessage.ogp = [];
    messages.value.push(data.newMessage);
    message.value = "";

    nextTick(() => {
        msgs.value.scrollTop = msgs.value.scrollHeight;
    });
};

const deleteMessage = async(id) => {
    let {data} = await axios.delete(`/api/user/${username}/messages/${id}`);

    messages.value = messages.value.filter((msg) => msg._id != id);
};

const copyClipBoard = (content) => {
    navigator.permissions.query({ name: "clipboard-read" }).then((result) => {
        if (result.state != "granted" && result.state != "prompt") return;

        navigator.clipboard.writeText(content);
    });
};

const messageGetLinks = (text) => {
    let matchs = text.match(regex);

    return matchs || [];
};

const scroll = async() => {
    let initialHeight = msgs.value.scrollHeight;

    console.log(msgs.value.scrollTop)

    if(msgs.value.scrollTop > 50 || loadingNewMessages.value) return;
    loadingNewMessages.value = true;
    page.value++;
    await loadNewMessages();
    nextTick(() => {
        msgs.value.scrollTop = msgs.value.scrollHeight-initialHeight;
    });
    loadingNewMessages.value = false;
};

const popups = ref({});

const openPopup = (_id) => {
    popups.value[_id] = true;
};
</script>

<template>
    <div class="w-full h-full flex flex-row items-center lg:justify-normal justify-center">
        <dashnav/>
        <loadingAn v-if="loadingPage"/>
        <div v-else class="w-full h-full flex flex-col items-end">
            <div class="flex flex-col w-full lg:w-5/6 h-full items-center justify-center gap-5 p-4">
                <modal :user="user" v-if="popups[user._id]" @close-modal="popups[user._id] = false"/>
                <modal :user="myUser" v-if="popups[myUser._id]" @close-modal="popups[myUser._id] = false"/>
                <div @click="openPopup(user._id)" class="cursor-pointer w-full bg-gray-800 p-4 flex flex-row rounded-full items-center gap-2">
                    <img draggable="false" :src="user.profilePhoto" class="rounded-full" width="32" alt="">
                    <h1>{{username}}</h1>
                    <span :class="`w-4 h-4 bg-${user.active ? 'green':'gray'}-600 rounded-full`"></span>
                </div>
                <div @scroll="scroll" id="animatemsgs" ref="msgs" class="h-full w-full bg-gray-800 overflow-y-scroll flex flex-col rounded-lg"> <!--v-auto-animate-->
                    <span class="w-full py-2 px-4 flex items-center justify-center text-gray-400" v-if="loadedMaxMessage">The beginning of the conversation with {{user.username}}!</span>
                    <div v-for="message in messages" :key="message._id" class="flex flex-col msgin w-full hover:bg-gray-700 py-2 px-4">
                        <div class="flex flex-row w-full justify-between items-center relative">
                            <div class="flex flex-col items-start select-all gap-2 w-full">
                                <div @click="openPopup(message.from._id)" class="flex flex-row gap-2 cursor-pointer">
                                    <img class="w-[32px] h-[32px] rounded-full" alt="" draggable="false" :src="message.from.profilePhoto" width="32">
                                    <span>{{ message.from.username }}</span>
                                </div>
                                <span class="select-text whitespace-normal w-full max-w-full">{{ message.content }}</span>
                                <iframe v-if="message.content.includes('open.spotify.com/track/')" class="rounded-xl max-w-full" :src="`https://open.spotify.com/embed/track/${message.content.split('/')[4].split('?')[0]}?utm_source=anomz`" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                            </div>
                            <div class="absolute right-0 -top-5 msgcompts">
                                <i :id="`msg_delete_btn_${message._id}`" v-if="message.from._id == myUser._id" @click="deleteMessage(message._id)" class="fa-solid fa-trash hover:text-red-600 cursor-pointer duration-300 shake flex"></i>
                                <i @click="copyClipBoard(message.content)" class="fa-solid fa-copy hover:text-blue-600 cursor-pointer duration-300"></i>
                            </div>
                            <!--<div class="flex flex-col items-center gap-2">
                                <span class="text-gray-400">{{ new Date(message.createdAt).toLocaleTimeString("tr",{
                                    hour:"numeric",
                                    minute:"numeric",
                                    second:"numeric",
                                    day:"numeric",
                                    month:"short",
                                    year:"numeric"
                                }) }}</span>
                                <div class="flex flex-row items-center justify-between w-full px-4">
                                    <i :id="`msg_delete_btn_${message._id}`" v-if="message.from._id == myUser._id" @click="deleteMessage(message._id)" class="fa-solid fa-trash hover:text-red-600 cursor-pointer duration-300 shake flex"></i>
                                    <i @click="copyClipBoard(message.content)" class="fa-solid fa-copy hover:text-blue-600 cursor-pointer duration-300"></i>
                                </div>
                            </div>-->
                        </div>
                        <a target="_blank" class="flex flex-col bg-gray-600 gap-1 duration-300 py-2 px-4 rounded-lg w-full lg:w-1/2" v-for="ogp in message.ogp" :href="ogp.url">
                            <span v-if="ogp.site_name && ogp.title != ogp.site_name">{{ ogp.site_name }}</span>
                            <span v-if="ogp.title">{{ ogp.title }}</span>
                            <span v-if="ogp.description">{{ ogp.description }}</span>
                            <img draggable="false" class="rounded-lg w-1/2" v-if="ogp.image" :src="ogp.image" alt="">
                        </a>
                    </div>
                </div>
                <form @submit.prevent="send" class="flex flex-row items-center w-full bg-gray-700 rounded-full px-4">
                    <input placeholder="my message" v-model="message" class="w-full rounded-none focus:ring-0" type="text">
                    <div class="flex gap-5 flex-row items-center">
                        <button type="submit"><i class="fa-solid fa-paperclip text-gray-300"></i></button>
                        <button type="submit"><i class="fa-solid fa-paper-plane text-gray-300"></i></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
