<script setup>

const {title,description,price,best_value} = defineProps(['title','description','best_value','price']);

</script>

<template>
    <div class="lg:w-1/3 w-full bg-gray-800 py-2 px-2 flex flex-col items-center gap-3 rounded-lg">
        <div class="py-4 px-4 rounded-lg w-full flex flex-row items-center justify-between bg-gray-700">
            <span class="text-lg font-semibold">{{ title }}</span>
            <div v-if="best_value" class="py-1 px-2 rounded-full bg-purple-800/50 text-xs flex flex-row items-center gap-1 text-purple-400">
                <i class="fa-solid fa-bolt text-purple-400"></i>
                <span class="text-purple-400">Best value</span>
            </div>
        </div>
        <div class="py-2 px-2 w-full flex flex-col items-start gap-3">
            <span>{{ description }}</span>
            <span class="text-3xl font-semibold">{{ price }}</span>
            <div v-for="i in [1,2,3,4,5]" class="flex flex-row items-center gap-3">
                <i class="fa-solid fa-check text-green-600"></i>
                <span>Daily 1.000 messages</span>
            </div>
            <button class="bg-indigo-600 hover:bg-indigo-800 duration-300 w-full flex flex-row items-center justify-between rounded-full py-2 px-4">
                <span>Get Started</span>
                <i class="fa-solid fa-up-right-from-square"></i>
            </button>
        </div>
    </div>
</template>