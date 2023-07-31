<script setup>

    definePageMeta({
        middleware: [
            'auth',
        ],
    });

    import useAPI from '~/composables/axios';

    const axios = useAPI();

    const myUser = useState("user");

    let err = ref("");

    let loading = ref(false);
    let loadingValue = ref(0);
    let loadingMessage = ref(0);

    let input = document.createElement('input');
    input.type = 'file';
    input.accept = "image/*"

    input.addEventListener('change',(e) => {
        loading.value = true;
        loadingValue.value = 0;
        loadingMessage.value = "File reading!";
        err.value = "";

        let file = e.target.files[0];

        if(!file.type.includes("image")) return err.value = "Unsupport type!";

        let reader = new FileReader();

        reader.readAsDataURL(file);
        
        reader.addEventListener('loadstart',(data) => {
            console.log(data)
            if(data.total >= 20971520) {
                err.value = "Maximum file size is 20 MB!";
                return reader.abort();
            }
        });

        reader.addEventListener('progress',(data) => {
            loadingValue.value = (data.loaded/data.total)*100;
        });

        reader.addEventListener('loadend',(data) => {
            loading.value = false;
            loadingMessage.value = "File readed!";

            myUser.value.profilePhoto = data.target.result;
        });

        reader.addEventListener('abort',() => {
        });
    });

    const process = async() => {
        if(loading.value) return;

        loading.value = true;
        loadingMessage.value = "File uploading!";

        const formData = new FormData();
        formData.append("profilePhoto",input.files[0],input.files[0].name);

        let res = await axios.putForm(`/api/user/${myUser.value._id}`,formData,{
            onUploadProgress:(e) => {
                loading.value = e.progress*100;
            }
        });
        
        let data = res.data;
    
        console.log(data);
    };

    const photoChange = () => {
        input.click();
    };
</script>

<template>
    <form @submit.prevent="process" class="lg:w-2/3 w-full h-full flex flex-col gap-2 items-center justify-center">
        <div @click="photoChange" class="photochanger relative">
            <img :src="myUser.profilePhoto" class="rounded-full" width="64" alt="">
            <i class="fa-sharp fa-solid fa-user-pen absolute w-full h-full bg-black bg-opacity-30 rounded-full top-0 left-0 flex items-center justify-center"></i>
        </div>
        {{ loading.progress }}
        <span class="w-full h-1 bg-blue-800 block rounded-full z-10">
            <span :style="`width: ${loadingValue}%;`" :class="`h-1 block bg-blue-600 z-50 rounded-full`"></span>
        </span>
        <span>Maximum photo size: 20MB</span>
        <button class="bg-green-600 hover:bg-green-800 rounded cursor-pointer py-2 px-4 focus:ring transition duration-300">Process the changes.</button>
        <!--<div class="flex flex-col items-center" v-if="loading.status">
            <span>{{ loading.progress }}%</span>
            <span>{{ loading.message }}</span>
        </div>-->
        <div :class="`py-2 px-4 w-full rounded-full bg-red-100 text-red-600 duration-300 ${err ? 'opacity-100 visible' : 'opacity-0 invisible'}`">
            {{ err }}
        </div>
    </form>
</template>
