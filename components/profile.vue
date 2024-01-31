<script setup>

const {width,height,src} = defineProps(['width','height','src']);

</script>

<template>
    <img :src="src" :class="`rounded-full`" :style="{
        width:`${width}px`,
        height:`${height}px`
    }" :width="width" :height="height" draggable="false" @contextmenu.prevent alt="">
</template>
