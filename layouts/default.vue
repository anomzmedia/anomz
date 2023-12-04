<script setup>
const user = useState("user");
const sock = useState("sock");
const token = useCookie("token");

const {public:{apiUrl}} = useRuntimeConfig();

const route = useRoute();

//import {initIO} from "../composables/socket";

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

onMounted(() => {
    if(!user.value) return;
    
    initIO();
});

</script>

<template>
    <div class="w-full h-full">
        <navbar v-if="!route.path.includes('dashboard')"/>
        <mobile-navbar v-if="!route.path.includes('dashboard')"/>
        <div class="w-full h-full">
            <slot/>
        </div>
    </div>
</template>
