<script setup>
    import axios from "axios";

    definePageMeta({
        middleware: [
            'no-auth',
        ],
    });

    const {public:{apiUrl}} = useRuntimeConfig();

    let loading = ref(false);

    let err = ref("");
    let result = ref(null);
    let passwordIsReadable = ref(false);

    const generateAccount = async() => {
        if(loading.value) return;

        loading.value = true;

        let res = await axios.post(`${apiUrl}/api/auth/register`);
        let data = res.data;

        if(!data.success) return err.value = data.message;

        loading.value = false;

        result.value = data;
    };

    const copy = (text) => {
        navigator.clipboard.writeText(text);
    };

    const download = () => {        
        const blob = new Blob([JSON.stringify(result.value.user, null, 2)], {
            type: "application/json",
        });

        let u = URL.createObjectURL(blob);

        let a = document.createElement('a');
        a.href = u;
        a.download = `credentials_${result.value.user.username}.json`
        document.body.appendChild(a);
        a.click();
        a.remove();
    };
</script>

<template>
    <div class="w-full h-full flex items-center justify-center">
        <form @submit.prevent="generateAccount" class="lg:h-3/4 lg:w-3/4 w-full h-full flex flex-row items-center justify-center rounded-lg relative">
            <img src="/arasemr12_ubuntu_2a5cbf0a-8cac-4598-baab-b190706ee3d5.png" draggable="false" class="w-1/2 h-full rounded-tl-lg rounded-bl-lg lg:block hidden" alt="">
            <div v-if="loading" class="w-full lg:w-1/2 bg-gray-800 rounded-tr-lg rounded-br-lg h-full flex items-center justify-center">
                <Loading/>
            </div>
            <div v-else-if="result" class="w-full lg:w-1/2 bg-gray-800 rounded-tr-lg rounded-br-lg h-full justify-center flex flex-col p-4 gap-5">
                <div class="w-full flex flex-col gap-1">
                    <label for="username">username</label>
                    <div class="w-full flex flex-row items-center bg-gray-700 py-2 px-4 rounded">
                        <input id="username" type="text" :value="result.user.username" class="w-full p-0" readonly>
                        <i class="fa-solid fa-copy cursor-pointer" @click="copy(result.user.username)"></i>
                    </div>
                </div>
                <div class="w-full flex flex-col gap-1">
                    <label for="password">password</label>
                    <div class="w-full flex flex-row items-center bg-gray-700 py-2 px-4 rounded">
                        <input id="password" type="text" :value="result.user.password" :class="`w-full p-0 ${passwordIsReadable ? '' : 'blur-sm select-none'}`" style="pointer-events: none;" readonly>
                        <i @click="passwordIsReadable = !passwordIsReadable" :class="`cursor-pointer fa-solid mr-4 fa-eye${passwordIsReadable ? '' : '-slash'}`"></i>
                        <i class="fa-solid fa-copy cursor-pointer" @click="copy(result.user.password)"></i>
                    </div>
                </div>
                <!--<span class="select-text">ID: {{ result.user.id }}</span>
                <span class="select-text">PASSWORD: {{ result.user.password }}</span>
                <button type="button" @click="copy" class="blue-btn">COPY ID AND PASSWORD</button>
                <nuxt-link class="blue-btn text-center" to="/login">Login</nuxt-link>-->
                <button type="button" @click="download" class="green_rounded_btn flex flex-row items-center justify-between">Download credentials file <i class="fa-solid fa-download"></i></button>
                <nuxt-link to="/login" type="button" class="blue_rounded_btn flex flex-row items-center justify-between">Go to login page <i class="fa-solid fa-right-to-bracket"></i></nuxt-link>
            </div>
            <div v-else class="w-full lg:w-1/2 bg-gray-800 rounded-tr-lg rounded-br-lg h-full flex flex-col items-center justify-center p-4 gap-5">
                <button type="submit" class="blue_rounded_btn">Generate a account</button>
                <button type="button" class="green_rounded_btn">Recover a account</button>
            </div>
        </form>
    </div>
</template>
