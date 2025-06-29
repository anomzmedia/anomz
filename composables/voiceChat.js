const callUser = async(userId) => {
    const sock = useState("sock");
    const peerConnection = useState("peerConnection");
    const callStatus = useState("callStatus");

    let stream = await navigator.mediaDevices.getUserMedia({video:false,audio:true});

    stream.getTracks().forEach((t) => {
        peerConnection.value.addTrack(t,stream);
    });

    const offer = await peerConnection.value.createOffer({
        offerToReceiveAudio:true,
        offerToReceiveVideo:true
    });
    
    await peerConnection.value.setLocalDescription(offer);

    sock.value.emit("makeOffer",{
        offer:{
            sdp:offer.sdp,
            type:offer.type
        },
        to:userId
    });

    callStatus.value = {
        calling:true,
        userId,
        offer:{
            sdp:offer.sdp,
            type:offer.type
        }
    };
};

const cancelCall = () => {
    const callStatus = useState("callStatus");
    const sock = useState("sock");

    sock.value.emit("cancelOffer",{
        to:callStatus.value.userId
    });

    callStatus.value = null;
};

const acceptCall = async() => {
    const {RTCSessionDescription} = window;

    const callStatus = useState("callStatus");
    const peerConnection = useState("peerConnection");
    const sock = useState("sock");

    let stream = await navigator.mediaDevices.getUserMedia({video:false,audio:true});

    stream.getTracks().forEach((t) => {
        peerConnection.value.addTrack(t,stream);
    });

    await peerConnection.value.setRemoteDescription(new RTCSessionDescription(callStatus.value.offer));

    let answer = await peerConnection.value.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    });
    peerConnection.value.setLocalDescription(answer);

    sock.value.emit("makeAnswer",{
        to:callStatus.value.userId,
        answer:{
            sdp:answer.sdp,
            type:answer.type
        }
    });
};

const rejectCall = () => {
    const sock = useState("sock");
    const callStatus = useState("callStatus");

    sock.value.emit("rejectOffer",{
        to:callStatus.value.userId
    });

    callStatus.value = null;
};

export {callUser,cancelCall,acceptCall,rejectCall};
