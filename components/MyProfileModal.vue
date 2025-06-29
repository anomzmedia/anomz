<script setup>

const user = useState("user");
const token = useCookie("token");

const {public:{apiUrl}} = useRuntimeConfig();

const {active,close} = defineProps(["active","close"]);

const router = useRouter();

const logout = () => {
    router.push("/");
    
    token.value = null;
    user.value = null;

    try {
        closeIO();
    } catch (error) {
        
    }
};

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
    let input = document.createElement('input');
    input.type = "file";
    input.style = "display:none";

    input.addEventListener('change',avatarFileInputChange)

    document.body.appendChild(input);

    input.click();
};

</script>

<template>
    <div v-if="user" :class="`w-full h-full fixed top-0 left-0 bg-black/30 z-50 flex items-center justify-center duration-300 ${active ? 'opacity-100 visible' : 'opacity-0 invisible'}`">
        <div :class="`lg:w-2/3 lg:h-2/3 w-full h-full bg-gray-800 rounded-lg flex flex-col border-2 border-gray-700 duration-300 ${active ? 'scale-100' : 'scale-0'}`">
            <div class="w-full py-2 px-4 flex flex-row items-center justify-between border-b-2 border-gray-700">
                <span class="text-xl font-semibold select-none">{{user.username}}</span>
                <button class="py-2 px-4 bg-red-600 hover:bg-red-800 duration-300 rounded font-semibold" @click="close">X</button>
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
</template>