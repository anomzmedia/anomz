<script setup>

definePageMeta({
    middleware: [
        'auth',
    ],
    layout:"dashboard"
});

</script>

<template>
    <div class="w-full h-full overflow-y-auto py-4 px-4">
        <span class="text-xl">Hey 👋, You can use the search button on the left menu to find the person you want to talk...</span>
    </div>
</template>
