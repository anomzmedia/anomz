<script setup>
definePageMeta({
    middleware: [
        'auth',
    ],
    layout:"dashboard"
});

const {public:{apiUrl}} = useRuntimeConfig();

const route = useRoute();
const router = useRouter();

const user = ref(null);
const myUser = useState("user");

const username = ref(route?.params?.id);

const token = useCookie("token");

const log = ref("");

const sock = useState("sock");

const sendLog = (msg) => {
    log.value+=`${msg}\n`;
};

(async() => {
    if(!username.value || myUser.value.username == username.value) return router.push("/dashboard/");

    let {data} = await useFetch(`${apiUrl}/api/user/${username.value}`,{
        headers:{
            Authorization:token.value
        }
    });

    if(!data.value || !data.value.success) return router.push("/dashboard/friends");

    user.value = data.value.find;

    if(!process.client) return;

    nextTick(async() => {
        sock.value.emit("getVoiceInfo",{
            userId:user.value.id
        },(res) => {
            console.log(res);
        });
    });
})();

const peerConnection = ref(null);

const local = ref(null);

onMounted(() => {
    const { RTCPeerConnection, RTCSessionDescription } = window;

    const conf = {
        configuration: {
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        },
        iceServers: [{
            urls:[
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302",
                "stun:stun01.sipphone.com",
                "stun:stun.ekiga.net",
                "stun:stun.fwdnet.net",
                "stun:stun.ideasip.com",
                "stun:stun.iptel.org",
                "stun:stun.rixtelecom.se",
                "stun:stun.schlund.de",
                "stun:stunserver.org",
                "stun:stun.softjoys.com",
                "stun:stun.voiparound.com",
                "stun:stun.voipbuster.com",
                "stun:stun.voipstunt.com",
                "stun:stun.voxgratia.org",
                "stun:stun.xten.com",
            ]
        }]
    };

    peerConnection.value = new RTCPeerConnection(conf);

    nextTick(() => {
        sock.value.on("madeOffer",(data) => {
            if(data.fromId != user.value.id) return;
            waitingAnswer.value = true;
        });
    });
});

const stream = ref(null);

const calling = ref(false);
const waitingAnswer = ref(false);

const call = async() => {
    calling.value = true;

    stream.value = await navigator.mediaDevices.getUserMedia({video:true,audio:true});

    stream.value.getTracks().forEach((track) => {
        peerConnection.value.addTrack(track,stream.value);
    });

    local.value.srcObject = stream.value;

    let offer = await peerConnection.value.createOffer();
    await peerConnection.value.setLocalDescription(offer);

    sock.value.emit("makeOffer",{
        offer:{
            sdp:offer.sdp,
            type:offer.type
        },
        userId:user.value.id
    });
};

const makeAnswer = () => {
    
};

const leaveCall = () => {
    calling.value = false;

    stream?.value?.getTracks()?.forEach((track) => {
        track.stop();
    });
};

</script>

<template>
    <div class="w-full h-full flex flex-col items-center" v-if="user">
        <div class="w-full flex flex-row items-center">
            <video class="w-1/2" ref="local" autoplay playsinline></video>
            <video class="w-1/2" ref="remote" autoplay playsinline></video>
        </div>
        <div v-if="waitingAnswer" class="">
            <button @click="makeAnswer">make answer</button>
        </div>
        <div v-else class="">
            <button v-if="calling" @click="leaveCall">leave call</button>
            <button v-else @click="call">make call</button>
        </div>
    </div>
</template>