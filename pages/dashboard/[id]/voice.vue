<script setup>
definePageMeta({
    middleware: [
        'auth',
    ],
});

const {public:{apiUrl}} = useRuntimeConfig();

const router = useRouter();
const route = useRoute();

const username = ref(route?.params?.id);

const myUser = useState("user");
const user = ref(null);

const token = useCookie("token");

const sock = useState("sock");

(async() => {
    if(!username.value || myUser.value.username == username.value) return router.push("/dashboard/friends");

    let {data} = await useFetch(`${apiUrl}/api/user/${username.value}`,{
        headers:{
            Authorization:token.value
        }
    });

    if(!data.value || !data.value.success) return router.push("/dashboard/friends");

    user.value = data.value.find;
})();

const calling = ref(false);

const audioContext = ref(null);
const stream = ref(null);
const ai = ref(null);
const recorder = ref(null);

const pingInterval = ref(null)

const ping = ref(100);

onMounted(() => {
    audioContext.value = new AudioContext();

    nextTick(() => {
        sock.value.removeAllListeners("voice");
        sock.value.on("voice",(d) => {
            console.log(d);
            d = new Float32Array(d);
            var audioBuffer = audioContext.value.createBuffer(1, d.length, audioContext.value.sampleRate);
            audioBuffer.getChannelData(0).set(d);
            var source = audioContext.value.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.value.destination);
            source.start(0);
        });

        pingInterval.value = setInterval(() => {
            const start = Date.now();

            sock.value.emit("ping", () => {
                const duration = Date.now() - start;
                ping.value = duration;
            });
        }, 1000);
    });
});

const call = () => {
    audioContext.value = new AudioContext();

    sock.value.emit("voicejoin",user.value.id);
    calling.value = true;

    navigator.mediaDevices.getUserMedia({audio:true,video:false}).then((ss) => {
        stream.value = ss;

        ai.value = audioContext.value.createMediaStreamSource(stream.value);
        recorder.value = (audioContext.value.createScriptProcessor || audioContext.value.createJavaScriptNode).call(audioContext.value, 4096, 1, 1);

        ai.value.connect(recorder.value);
        recorder.value.connect(audioContext.value.destination);

        recorder.value.addEventListener('audioprocess',(e) => {
            let l = e.inputBuffer.getChannelData(0);

            sock.value.emit("voice",{
                to:user.value.id,
                buffer:l
            });
        });
    });
};

const leaveCall = () => {
    sock.value.emit("voiceleft",user.value.id);
    calling.value = false;

    stream.value.getTracks().forEach((track) => {
        track.stop();
    });

    audioContext.value.close();
};

</script>

<template>
    <div class="w-full h-full flex flex-row items-center lg:justify-normal justify-center">
        <dashnav/>
        <div v-if="user" class="flex flex-col w-full lg:w-5/6 h-full items-center p-4">
            <div class="w-full bg-gray-800 py-2 px-4 rounded-full">
               <span>{{ user.username }}</span>
            </div>
            <!--<div class="w-full h-full overflow-y-scroll flex flex-col items-center">
                <button v-if="calling" @click="leaveCall">leave call</button>
                <button v-else @click="call">make call</button>
            </div>-->
            <div class="w-full h-full overflow-y-scroll flex flex-col items-center gap-5">
                <div class="w-full flex flex-row items-center justify-center p-4 gap-5">
                    <img :src="myUser.profilePhoto" class="rounded-full border-4 border-green-600" width="96" draggable="false" alt="">
                    <img :src="user.profilePhoto" class="rounded-full" width="96" draggable="false" alt="">
                </div>
                <div class="flex flex-row items-center gap-5" v-if="!calling">
                    <button @click="call" class="bg-green-600 py-2 px-3 rounded-full tooltipbtn whitespace-nowrap">
                        <span class="tooltip">Start Voice Call</span>
                        <i class="fa-solid fa-phone"></i>
                    </button>
                </div>
                <div v-else class="flex flex-row items-center gap-5">
                    <button @click="leaveCall" class="bg-red-600 py-2 px-3 rounded-full tooltipbtn whitespace-nowrap">
                        <span class="tooltip">Close Call</span>
                        <i class="fa-solid fa-phone-slash"></i>
                    </button>
                    <button class="bg-gray-800 py-2 px-3 rounded-full tooltipbtn whitespace-nowrap">
                        <span class="tooltip">Share Screen</span>
                        <i class="fa-solid fa-display"></i>
                    </button>
                </div>
                <div class="flex flex-col w-full">
                    <span>Ping: {{ping}}ms</span>
                    <span>Server: Turkiye, Istanbul</span>
                </div>
            </div>
        </div>
    </div>
</template>
