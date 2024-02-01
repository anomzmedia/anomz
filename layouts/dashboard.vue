<script setup>
import { vAutoAnimate } from '@formkit/auto-animate';

const user = useState("user");
const token = useCookie("token");

const {public:{apiUrl}} = useRuntimeConfig();

const route = useRoute();
const router = useRouter();

const sock = useState("sock");

(async() => {
    if(!token.value) return;
    
    let {data} = await useFetch(`${apiUrl}/api/auth/me`,{
        headers:{
            Authorization:token.value
        }
    });

    if(!data.value || !data.value.success) return token.value = null;
    user.value = data.value.user;
})();

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js", {
        scope: "/",
      });
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

const audio = ref(null);

const playSound = () => {
    audio.value.play();
};

onMounted(() => {
    registerServiceWorker();

    if(user.value) initIO();

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-Y7SZD3FFP8');

    document.addEventListener('keydown',(e) => {
        if(e.ctrlKey && e.code == "KeyK"){
            e.preventDefault();
            searchModal.value = !searchModal.value;
        }

        if(e.code == "Escape"){
            userModal.value = false;
            searchModal.value = false;
        }
    });

    sock.value.on('message',(t) => {
        if(!t.channel) return;
        peoples.value = peoples.value.filter((e) => e.id != t.channel);
        peoples.value.unshift(t.message.from);
    
        if(!route.fullPath.includes(t.message.from.username)){
            playSound();
            sendNotif(t.message.from);
        }
    });

    audio.value = new Audio("/notif.mp3");
});

const peoplesActive = ref(true);
const groupsActive = ref(false);

const peoples = useState("peoples",() => []);
const groups = ref([]);

const peoplesLoading = ref(true);
const groupsLoading = ref(true);

const searchModal = ref(false);
const searchUsername = ref("");
const searchFind = ref(null);
const searchLoading = ref(false);
const userModal = ref(false);

const avatarFileInputChange = async(e) => {
    let file = e.target.files[0];
    //10 MB = 10485760 BAYT
    if(file.size > 10485760 && !file.type.includes('image')) return;

    let data = new FormData();
    data.append('avatar', file);

    let res = await fetch(`${apiUrl}/api/user/me`,{
        method:"PUT",
        body:data,
        headers:{
            Authorization:token.value
        }
    });
    let json = await res.json();

    if(!json.success) return;

    user.value.profilePhoto = json.avatar;
};

const uploadAvatar = () => {
    //avatarFileInput.click()
    let input = document.createElement('input');
    input.type = "file";
    input.style = "display:none";

    input.addEventListener('change',avatarFileInputChange)

    document.body.appendChild(input);

    input.click();
};

watch(searchUsername,async(val,oldVal) => {
    if(!val) return searchFind.value = null;
    searchLoading.value = true;

    let {data} = await useFetch(`${apiUrl}/api/user/${val}`);
    
    searchLoading.value = false;

    searchFind.value = data?.value?.find;
});

(async() => {
    let {data} = await useFetch(`${apiUrl}/api/user/`,{
        headers:{
            Authorization:token.value
        }
    });

    peoples.value = data.value.find;
    peoplesLoading.value = false;
})();

(async() => {
    let {data} = await useFetch(`${apiUrl}/api/group/all`,{
        headers:{
            Authorization:token.value
        }
    });

    groups.value = data.value.find;
    groupsLoading.value = false;
})();

const logout = () => {
    router.push("/");
    
    token.value = null;
    user.value = null;
};

const notifUser = ref({
    profilePhoto:"/9.png",
    username:"78892ad2620c3bbe"
});

const notifActive = ref(false);
const notifTimeout = ref(null);

const sendNotif = (user) => {
    notifUser.value = user;

    try {
        clearTimeout(notifTimeout.value);
    } catch (error) {
        
    }

    notifActive.value = true;

    notifTimeout.value = setTimeout(() => {
        notifActive.value = false;
    }, 2000);
};

const closeNotif = () => {
    try {
        clearTimeout(notifTimeout.value);
    } catch (error) {
        
    }

    notifActive.value = false;
};

</script>

<template>
    <div class="w-full h-full flex flex-row items-center">
        <div @click="closeNotif" :class="`flex flex-col items-center fixed top-5 lg:w-1/2 xl:w-1/3 w-full left-1/2 -translate-x-1/2 bg-gray-800/30 backdrop-blur-sm py-2 px-4 rounded-lg border-2 border-gray-700/30 duration-300 cursor-pointer hover:scale-110 ${notifActive ? 'opacity-100 visible -translate-y-0' : 'opacity-0 invisible -translate-y-4'}`">
            <div class="flex flex-row items-center gap-3">
                <Profile :src="notifUser.profilePhoto" width="32" height="32"/>
                <span>{{ notifUser.username }}</span>
            </div>
            <div class="w-full flex items-center justify-center">
                <span>You have received a new message!</span>
            </div>
        </div>
        <div :class="`w-full h-full fixed top-0 left-0 bg-black/30 z-50 flex items-center justify-center duration-300 ${searchModal ? 'opacity-100 visible' : 'opacity-0 invisible'}`">
            <div :class="`lg:w-2/3 lg:h-2/3 w-full h-full bg-gray-800 rounded-lg flex flex-col border-2 border-gray-700 duration-300 ${searchModal ? 'scale-100' : 'scale-0'}`">
                <div class="w-full py-2 px-4 flex flex-row items-center justify-between border-b-2 border-gray-700">
                    <span>Search</span>
                    <button @click="searchModal = !searchModal">X</button>
                </div>
                <div class="h-full flex flex-col items-center justify-center overflow-auto py-2 px-4 gap-5">
                    <input v-model="searchUsername" class="w-full rounded-full" type="text" placeholder="username">
                    <div v-if="searchLoading" class="w-full flex items-center justify-center">
                        <Loading/>
                    </div>
                    <nuxt-link v-else-if="searchFind" @click="searchModal = false" :to="`/dashboard/${searchFind.username}`" class="flex flex-row items-center gap-3 bg-gray-700 rounded-full py-2 px-4">
                        <Profile :src="searchFind.profilePhoto" width="32" height="32"/>
                        <span>{{ searchFind.username }}</span>
                    </nuxt-link>
                    <div v-else class="flex items-center justify-center w-full">
                        <span class="text-gray-400 select-none">User not found.. 🙁</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="user" :class="`w-full h-full fixed top-0 left-0 bg-black/30 z-50 flex items-center justify-center duration-300 ${userModal ? 'opacity-100 visible' : 'opacity-0 invisible'}`">
            <div :class="`lg:w-2/3 lg:h-2/3 w-full h-full bg-gray-800 rounded-lg flex flex-col border-2 border-gray-700 duration-300 ${userModal ? 'scale-100' : 'scale-0'}`">
                <div class="w-full py-2 px-4 flex flex-row items-center justify-between border-b-2 border-gray-700">
                    <span>{{user.username}}</span>
                    <button @click="userModal = !userModal">X</button>
                </div>
                <div class="h-full flex flex-col items-center overflow-auto py-2 px-4 gap-5">
                    <div class="avatar relative cursor-pointer rounded-full" @click="uploadAvatar">
                        <div class="absolute top-0 left-0 w-full h-full rounded-full bg-black/30 flex items-center justify-center avatarin">
                            <i class="fa-solid fa-image"></i>
                        </div>
                        <Profile :src="user.profilePhoto" width="96" height="96"/>
                    </div>
                    <span>Max File Size: 10 MB</span>
                    <button class="py-2 px-4 rounded-full bg-gray-700">Reset Password</button>
                    <button class="py-2 px-4 rounded-full bg-gray-700" @click="logout">Logout</button>
                    <nuxt-link class="text-green-400" to="/visibility">Who can see my data?</nuxt-link>
                </div>
            </div>
        </div>
        <div class="h-full w-full lg:w-1/6 p-4 bg-gray-800 hidden lg:flex flex-col items-center overflow-auto gap-5">
            <nuxt-link to="/dashboard/">
                <img src="/anomz2.png" width="64" alt="">
            </nuxt-link>
            <button @click="searchModal = !searchModal" class="flex flex-row items-center justify-between w-full bg-gray-700 py-2 px-4 rounded-lg text-sm">
                <div class="flex flex-row items-center gap-3">
                    <i class="fa-solid fa-magnifying-glass text-gray-400"></i>
                    <span class="text-gray-400">Search</span>
                </div>
                <span class="p-1 bg-gray-600 rounded">Ctrl K</span>
            </button>
            <div @click="peoplesActive = !peoplesActive" class="flex flex-row items-center w-full gap-2 text-sm cursor-pointer">
                <i :class="`fa-solid fa-chevron-right text-gray-400 duration-300 ${peoplesActive ? 'rotate-90' : ''}`"></i>
                <span class="text-gray-400">Peoples</span>
            </div>
            <div v-if="peoplesActive && peoples.length > 0" class="flex flex-col w-full gap-3" v-auto-animate>
                <nuxt-link :to="`/dashboard/${people.username}/`" class="flex flex-row items-center hover:bg-gray-700 p-1 w-full duration-300 rounded gap-3" v-for="people in peoples" :key="people.id">
                    <Profile :src="people.profilePhoto" width="32" height="32"/>
                    <span class="overflow-hidden text-ellipsis">{{ people.username }}</span>
                </nuxt-link>
            </div>
            <div class="w-full flex items-center justify-center" v-if="peoplesLoading && peoplesActive">
                <Loading/>
            </div>
            <div class="w-full flex items-center justify-center" v-if="!peoplesLoading && peoples.length < 1 && peoplesActive">
                <span class="text-xs text-gray-400 select-none">Sanırım hiç arkadaşın yok.. 🙁</span>
            </div>
            <div @click="groupsActive = !groupsActive" class="flex flex-row items-center w-full gap-2 text-sm cursor-pointer">
                <i :class="`fa-solid fa-chevron-right text-gray-400 duration-300 ${groupsActive ? 'rotate-90' : ''}`"></i>
                <span class="text-gray-400">Groups</span>
            </div>
            <div v-if="groupsActive && groups.length > 0" class="flex flex-col w-full gap-3">
                <nuxt-link :to="`/dashboard/groups/${group.id}/`" class="flex flex-row items-center hover:bg-gray-700 p-1 w-full duration-300 rounded gap-3" v-for="group in groups" :key="group.id">
                    <Profile :src="group.profilePhoto" width="32" height="32"/>
                    <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{ group.name }}</span>
                </nuxt-link>
                <nuxt-link class="flex flex-row items-center bg-gray-700 py-2 px-4 gap-3 rounded-full" to="/dashboard/groups/create">
                    <i class="fa-solid fa-plus"></i>
                    <span>Create new group</span>
                </nuxt-link>
            </div>
            <div class="w-full flex items-center justify-center" v-if="groupsLoading && groupsActive">
                <Loading/>
            </div>
            <div @click="userModal = !userModal" class="flex flex-row items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 duration-300 border-[1px] border-gray-500 cursor-pointer w-full py-2 px-4 rounded-full" v-if="user">
                <Profile :src="user.profilePhoto" width="32" height="32"/>
                <span class="text-ellipsis overflow-hidden">{{ user.username }}</span>
            </div>
        </div>
        <div class="w-full lg:w-5/6 h-full">
            <slot/>
        </div>
    </div>
</template>
