<script setup>
import useAPI from "~/composables/axios";
import {InitWS} from "~/composables/socket";
import {vAutoAnimate} from "@formkit/auto-animate";
import AOS from "aos"
import 'aos/dist/aos.css';

onMounted(() => {
    AOS.init();
});

const axios = useAPI();

const loading = ref(true);

const allNotifs = useState("notifs");
if(!allNotifs.value) allNotifs.value = [];

(async() => {
    const token = useCookie("token").value;
    if(!token) return loading.value = false;

    let res = await axios.get('/api/auth/me');
    let data = res.data;

    loading.value = false;

    if(!data.success) return useCookie("token").value = null;

    useState("user").value = data.user;
    InitWS();
})();

</script>


<template>
    <div id="notifications" class="fixed w-full top-0 left-0 flex flex-col items-center z-50 gap-2" v-auto-animate>
        <div class="py-2 px-4 bg-black rounded-full" v-for="notif in allNotifs">
            {{ notif.message }}
        </div>
    </div>
    <loadingAn v-if="loading"/>
    <div class="w-full h-full" translate="no" v-else @contextmenu.prevent>
        <navbar/>
        <div class="w-full h-full bg-gray-900 text-white flex flex-col items-center justify-center">
            <slot/>
        </div>
    </div>
</template>
