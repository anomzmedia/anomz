<script setup>

definePageMeta({
    middleware: [
        'auth',
    ],
    layout:"dashboard"
});

const {public:{apiUrl}} = useRuntimeConfig();
const token = useCookie("token");

const router = useRouter();
const route = useRoute();

const username = ref(route?.params?.id);

const myUser = useState("user");
const user = ref(null);

const sock = useState("sock");

const peerConnection = ref(null);

(async() => {
    let {data} = await useFetch(`${apiUrl}/api/user/${username.value}`,{
        headers:{
            Authorization:token.value
        }
    });

    if(!data.value.success) return router.push("/dashboard/");

    user.value = data.value.find;
})();

const stream = ref(null);

onMounted(async() => {
    stream.value = await navigator.mediaDevices.getUserMedia({audio:true,video:false});

    document.getElementById('local').srcObject = stream.value;

    const {RTCPeerConnection, RTCSessionDescription} = window;

    peerConnection.value = new RTCPeerConnection({
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
    });

    peerConnection.value.onicecandidate = (e) => {
        if(!e.candidate) return;

        sock.value.emit("icecandidate",{
            to:username.value,
            candidate:e.candidate
        });
    };

    peerConnection.value.ontrack = (e) => {
        document.getElementById('remote').srcObject = e.streams[0];
    }

    nextTick(() => {
        sock.value.emit("getVoiceStatus",username.value,(status) => {
            switch (status) {
                case "needAnswer":
                    needAnswer.value = true;
                    needOffer.value = false;
                    break;
                default:
                    break;
            }
        });

        sock.value.on("needAnswer",({from,offer}) => {
            if(from != username.value) return;

            needAnswer.value = true;
            needOffer.value = false;

            peerConnection.value.setRemoteDescription(new RTCSessionDescription(offer));
        });

        sock.value.on("madeAnswer",({answer,from}) => {
            if(from != username.value) return;

            peerConnection.value.setRemoteDescription(new RTCSessionDescription(answer));
        });

        sock.value.on("addCandidate",(candidate) => {
            peerConnection.value.addIceCandidate(candidate);
        });
    });
});

const needAnswer = ref(false);
const needOffer = ref(true);
const calling = ref(false);

const call = async() => {
    calling.value = true;

    stream.value.getTracks().forEach((track) => {
        peerConnection.value.addTrack(track,stream.value);
    });

    let offer = await peerConnection.value.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
    });
    await peerConnection.value.setLocalDescription(offer);

    sock.value.emit("makeOffer",{offer:{
        sdp:offer.sdp,
        type:offer.type
    },to:username.value});
};

const answer = async() => {
    stream.value.getTracks().forEach((track) => {
        peerConnection.value.addTrack(track,stream.value);
    });

    let answer = await peerConnection.value.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
    });
    await peerConnection.value.setLocalDescription(answer);

    sock.value.emit("makeAnswer",{
        answer:{
            sdp:answer.sdp,
            type:answer.type
        },
        to:username.value
    });
};

</script>

<template>
    <div v-if="user" class="w-full h-full flex flex-col items-center p-4">
        <div class="flex flex-row items-center gap-3">
            <Profile :src="user.profilePhoto" width="96" height="96"/>
            <Profile :src="myUser.profilePhoto" width="96" height="96"/>
        </div>
        <video id="remote" autoplay playsinline></video>
        <video id="local" autoplay playsinline muted></video>
        <div v-if="calling">
            <span>user calling..</span>
        </div>
        <div v-else-if="needOffer">
            <button @click="call">make call</button>
        </div>
        <div v-else-if="needAnswer">
            <button @click="answer">make answer</button>
        </div>
    </div>
</template>