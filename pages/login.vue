<script setup>
    import axios from 'axios';
    
    definePageMeta({
        middleware: [
            'no-auth',
        ],
    });

    const {public:{apiUrl}} = useRuntimeConfig();

    let loading = ref(false);

    let username = ref("");
    let password = ref("");

    let err = ref("");

    const token = useCookie("token");
    const user = useState("user");
    const router = useRouter();

    const fileinput = ref("");

    const login = (username,password) => {
        if(loading.value) return;

        loading.value = true;

        axios.post(`${apiUrl}/api/auth/login`,{
            username,
            password
        }).then((res) => {
            loading.value = false;

            if(!res.data.success) {
                return err.value = res.data.message;
            }

            token.value = res.data.token;
            user.value = res.data.user;
            router.push("/dashboard");

            initIO();
        }).catch((e) => {
            loading.value = false;
            err.value = e.response.data.message;
        });
    };

    const submit = () => {
        login(username.value,password.value);
    };

    const upload = () => {
        fileinput.value.click();
    };

    const fileChange = (f) => {
        const file = fileinput.value.files[0];
        const reader = new FileReader();

        reader.readAsText(file);

        reader.addEventListener('loadend',(f) => {
            try {
                let parsed = JSON.parse(f.target.result);
                if(!parsed || !parsed.username || !parsed.password) return err.value = "Incorrect file format!";
                login(parsed.username,parsed.password);
            } catch (error) {
                err.value = "Incorrect file format!";
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
            <div class="w-full lg:w-1/2 bg-gray-800 rounded-tr-lg rounded-br-lg h-full flex flex-col items-center justify-center p-4 gap-5">
                <h1 class="text-2xl font-semibold">Login</h1>
                <input v-model="username" type="text" class="w-full" placeholder="username" autocomplete="off" required>
                <div class="w-full flex flex-row items-center bg-gray-700 py-2 px-4 rounded">
                    <input v-model="password" :type="passwordVisible ? 'text' : 'password'" class="w-full p-0" placeholder="password" autocomplete="off" required>
                    <i @click="passwordVisible = !passwordVisible" :class="`fa-solid fa-eye${passwordVisible ? '-slash':''}`"></i>
                </div>
                <button v-if="loading" class="purple_rounded_btn w-full flex items-center justify-center"><Loading/></button>
                <button class="purple_rounded_btn w-full" v-else>login</button>
                <button v-if="!loading" class="green_rounded_btn w-full" type="button" @click="upload">Upload credentials file</button>
                <nuxt-link class="w-full link" to="/register">If you don't have account register!</nuxt-link>
                <div class="err w-full" v-if="err">
                    {{err}}
                </div>
            </div>
        </form>
    </div>
</template>
