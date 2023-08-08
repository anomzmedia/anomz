<script setup>

    import useAPI from "~/composables/axios";

    definePageMeta({
        middleware: [
            'no-auth',
        ],
    });

    const axios = useAPI();

    let loading = ref(false);

    let err = ref("");
    let result = ref(null);

    //let widgetId = ref("");

    /*const submit = async() => {
        //let {response,key} = await hcaptcha.execute(widgetId.value,{async:true});

        if(loading.value) return;

        loading.value = true;

        let res = await axios.post("/api/auth/register",{
            username:username.value,
            password:password.value,
            //response,
            //key,
        });

        loading.value = false;

        let data = res.data;

        if(data.success) return useRouter().push("/login");

        err.value = data.message;
    };*/

    const generateAccountNumberAndPassword = async() => {
        if(loading.value) return;

        loading.value = true;

        let res = await axios.post('/api/auth/register');
        let data = res.data;

        if(!data.success) return err.value = data.message;

        loading.value = false;

        result.value = data;
        console.log(data);
    };

    const copy = () => {
        navigator.clipboard.writeText(`ID: ${result.value.user.id}\nPASSWORD: ${result.value.user.password}`);
    };

    onMounted(() => {
        /*widgetId.value = hcaptcha.render('captcha-1', {
            sitekey: '67457393-0f7a-4949-ac26-51d33534d7fe',
            theme: 'dark',
            'error-callback': 'onError',
        });*/
    });
</script>

<template>
    <form @submit.prevent="generateAccountNumberAndPassword" class="lg:h-3/4 lg:w-3/4 w-full h-full flex flex-row items-center justify-center rounded-lg relative">
        <img src="/arasemr12_ubuntu_2a5cbf0a-8cac-4598-baab-b190706ee3d5.png" draggable="false" class="w-1/2 h-full rounded-tl-lg rounded-bl-lg lg:block hidden" alt="">
        <!--<div class="w-full lg:w-1/2 bg-gray-800 rounded-tr-lg rounded-br-lg h-full flex flex-col items-center justify-center p-4 gap-5">
            <span class="text-2xl">Register</span>
            <input v-model="username" type="text" class="w-full" placeholder="username" autocomplete="off">
            <input v-model="password" type="text" class="w-full" placeholder="password" autocomplete="off">
            <button v-if="loading" class="scbtn w-full flex items-center justify-center"><Loading/></button>
            <button v-else class="scbtn w-full">register</button>
            <div class="h-captcha" id="captcha-1" data-sitekey="10000000-ffff-ffff-ffff-000000000001" data-theme="dark" data-error-callback="onError"></div>
            <nuxt-link class="w-full link" to="/login">If you have account login!</nuxt-link>
            <span>Don't worry dude, we don't have nonsensical privacy agreements like other sites because we are anonymous! We do not share your information with anyone.</span>
            <div class="err w-full" v-if="err">
                {{ err }}
            </div>
        </div>-->
        <div v-if="loading" class="w-full lg:w-1/2 bg-gray-800 rounded-tr-lg rounded-br-lg h-full flex items-center justify-center">
            <Loading/>
        </div>
        <div v-else-if="result" class="w-full lg:w-1/2 bg-gray-800 rounded-tr-lg rounded-br-lg h-full flex flex-col justify-center p-4 gap-5">
            <span class="select-text">ID: {{ result.user.id }}</span>
            <span class="select-text">PASSWORD: {{ result.user.password }}</span>
            <button type="button" @click="copy" class="blue-btn">COPY ID AND PASSWORD</button>
            <nuxt-link class="blue-btn text-center" to="/login">Login</nuxt-link>
        </div>
        <div v-else class="w-full lg:w-1/2 bg-gray-800 rounded-tr-lg rounded-br-lg h-full flex flex-col items-center justify-center p-4 gap-5">
            <span class="text-2xl">Hesap numarası ve bir şifre alın.</span>
            <button type="submit" @click="generateAccountNumberAndPassword" class="blue-btn">Hesap numarası ve şifre al.</button>
        </div>
    </form>
</template>
