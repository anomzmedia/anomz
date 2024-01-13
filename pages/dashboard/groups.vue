<script setup>

    definePageMeta({
        middleware: [
            'auth',
        ],
    });

    const user = useState("user");

    const router = useRouter();

    const {public:{apiUrl}} = useRuntimeConfig();
    const token = useCookie("token");

    const newUsername = ref("");
    const users = ref([]);

    const addUser = () => {
        users.value.unshift(newUsername.value);
        newUsername.value = "";
    };
</script>

<template>
    <div class="w-full h-full flex flex-row items-center lg:justify-normal justify-center">
        <dashnav/>
        <form class="flex flex-col w-full lg:w-5/6 h-full items-center gap-5 p-4">
            <h1 class="text-xl font-semibold">Create a Group</h1>
            <input class="w-full" type="text" placeholder="name">
            <div class="flex flex-row items-center gap-3">
                <input type="text" placeholder="nickname" v-model="newUsername">
                <button type="button" @click="addUser">Add user</button>
            </div>
            <div class="w-full overflow-auto flex flex-col">
                <span v-for="a in users">{{a}}</span>
            </div>
            <button>Create Group</button>
        </form>
    </div>
</template>
