<script setup>

const {text,width,height} = defineProps(['text','width','height']);

let cf = ref("");

onMounted(() => {
    if(!process.client) return;
    let ctx = cf.value.getContext('2d');

    cf.value.width = "32";
    cf.value.height = "32";

    ctx.font = "16px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("F",cf.value.width/2,cf.value.height/2);
});

</script>

<template>
    <canvas :class="`w-[32px] h-[32px]`" ref="cf"></canvas>
</template>