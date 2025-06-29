<script setup>
    import axios from 'axios';
    
    definePageMeta({
        middleware: [
            'no-auth',
        ],
    });

    const {public:{apiUrl}} = useRuntimeConfig();

    //const loading = ref(false);

    const logging = ref(false);
    const uploading = ref(false);

    let username = ref("");
    let password = ref("");

    let err = ref("");

    const token = useCookie("token");
    const user = useState("user");
    const router = useRouter();

    const fileinput = ref("");

    const login = (username,password) => {
        if(logging.value) return;

        //logging.value = true;

        axios.post(`${apiUrl}/api/auth/login`,{
            username,
            password
        }).then((res) => {
            logging.value = false;
            uploading.value = false;

            if(!res.data.success) return err.value = res.data.message;

            token.value = res.data.token;
            user.value = res.data.user;
            
            nextTick(() => {
                initIO();
                router.push("/dashboard");
            });
        }).catch((e) => {
            logging.value = false;
            uploading.value = false;
            sendError(e?.response?.data?.message || e?.message);
            //err.value = e.response.data.message;
        });
    };

    const submit = () => {
        login(username.value,password.value);
        logging.value = true;
    };

    const upload = () => {
        fileinput.value.click();
    };

    const fileChange = (f) => {
        uploading.value = true;

        const file = fileinput.value.files[0];
        const reader = new FileReader();

        reader.readAsText(file);

        reader.addEventListener('loadend',(f) => {
            try {
                let parsed = JSON.parse(f.target.result);
                if(!parsed || !parsed.username || !parsed.password) {
                    uploading.value = false;
                    return err.value = "Incorrect file format!";
                }
                login(parsed.username,parsed.password);
            } catch (error) {
                err.value = "Incorrect file format!";
                uploading.value = false;
            }
        });
    };

    const passwordVisible = ref(false);
</script>

<template>
    <div class="w-full h-full flex items-center justify-center">
        <!--<div :class="`absolute top-3 bg-gray-800/50 w-1/2 px-4 py-4 rounded border-b-2 border-b-green-600 ${err ? 'notiactive' : 'notiinactive'}`">
            <span>{{ err }}</span>
        </div>-->
        <input @change="fileChange" type="file" class="hidden" ref="fileinput">
        <form @submit.prevent="submit" class="lg:h-3/4 lg:w-3/4 w-full h-full flex flex-row items-center justify-center rounded-lg relative">
            <img src="/TugboatMassacre_watercolor_painting_of_a_desert_large_cacti_ear_bcaff50f-da31-444c-b31f-208e10242640.png" draggable="false" class="w-1/2 h-full rounded-tl-lg rounded-bl-lg lg:block hidden" alt="">
            <div class="w-full lg:w-1/2 bg-gray-800 rounded-tr-lg rounded-br-lg h-full flex flex-col items-start justify-center p-4 gap-5">
                <h1 class="text-2xl font-semibold text-center w-full">Sign In</h1>
                <input v-model="username" type="text" class="w-full" placeholder="username" autocomplete="off" required>
                <div class="w-full flex flex-row items-center bg-gray-700 py-2 px-4 rounded">
                    <input v-model="password" :type="passwordVisible ? 'text' : 'password'" class="w-full p-0" placeholder="password" autocomplete="off" required>
                    <i @click="passwordVisible = !passwordVisible" :class="`fa-solid fa-eye${passwordVisible ? '-slash':''}`"></i>
                </div>
                <button type="submit" class="bg-indigo-600 hover:bg-indigo-800 duration-300 py-2 px-4 rounded flex flex-row items-center"><ButtonLoader size="12px" speed="2s" bg-opacity="0" color="#fff" :active="logging"/>Login</button>
                <button type="button" class="green_rounded_btn flex flex-row items-center" @click="upload"><ButtonLoader size="12px" speed="2s" bg-opacity="0" color="#fff" :active="uploading"/>Upload credentials file</button>
                <nuxt-link class="w-full link" to="/register">If you don't have account register!</nuxt-link>
                <div class="err w-full" v-if="err">
                    {{err}}
                </div>
            </div>
        </form>
    </div>
</template>
