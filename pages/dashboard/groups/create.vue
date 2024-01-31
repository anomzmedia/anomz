<script setup>

    definePageMeta({
        middleware: [
            'auth',
        ],
        layout:"dashboard"
    });

    const {public:{apiUrl}} = useRuntimeConfig();
    const token = useCookie("token");

    const user = useState("user");

    const router = useRouter();

    const page = ref(true);

    const changePage = () => page.value = !page.value;

    const name = ref(`${user.value.username}'s group`);

    const users = ref([]);

    const addUserModal = ref(false);
    const addUserUsername = ref("");
    const addUserFind = ref(null);
    const addUserLoading = ref(false);

    watch(addUserUsername,async(val,oldVal) => {
        addUserLoading.value = true;
        let {data} = await useFetch(`${apiUrl}/api/user/${val}`);
        addUserLoading.value = false;
        if(!data || !data.value) return addUserFind.value = null;

        addUserFind.value = data.value.find;
    });

    const addUser = () => {
        let find = users.value.find((e) => e.id == addUserFind.value.id);
        if(!find && addUserFind.value.id != user.value.id) users.value.push(addUserFind.value);

        addUserModal.value = false;
    };

    const deleteUser = (id) => {
        users.value = users.value.filter((e) => e.id != id);
    };

    const submit = async() => {
        let res = await fetch(`${apiUrl}/api/group/create`,{
            method:"POST",
            body:JSON.stringify({
                name:name.value,
                users:users.value.map((e) => e.id)
            }),
            headers:{
                'Content-Type':'application/json',
                'Authorization':token.value
            }
        });

        let json = await res.json();
        router.push(`/dashboard/groups/${json.group.id}`);
    };
</script>

<template>
    <div class="w-full h-full">
        <div v-if="addUserModal" class="fixed top-0 left-0 bg-black/30 w-full h-full flex items-center justify-center">
            <div class="lg:w-2/3 lg:h-2/3 w-full h-full bg-gray-800 border-gray-700 rounded-lg flex flex-col border-2">
                <div class="flex flex-row items-center justify-between border-b-2 border-gray-700 p-4">
                    <span>Add User</span>
                    <button @click="addUserModal = !addUserModal">X</button>
                </div>
                <div class="flex flex-col overflow-auto p-4 gap-3">
                    <input v-model="addUserUsername" type="text" class="w-full rounded-full" placeholder="username">
                    <div v-if="addUserLoading" class="w-full flex items-center justify-center">
                        <loading/>
                    </div>
                    <div @click="addUser" class="flex flex-row items-center justify-between bg-gray-700 hover:bg-gray-600 cursor-pointer duration-300 rounded-full py-2 px-4" v-else-if="addUserFind">
                        <div class="flex flex-row items-center gap-3">
                            <Profile :src="addUserFind.profilePhoto" width="32" height="32"/>
                            <span>{{ addUserFind.username }}</span>
                        </div>
                        <i class="fa-solid fa-user-plus"></i>
                    </div>
                    <div class="w-full flex items-center justify-center select-none" v-else>
                        <span class="text-gray-400">Böyle bir kullanıcıyı aradık fakat bulamadık.. 😔</span>
                    </div>
                </div>
            </div>
        </div>
        <form @submit.prevent="submit" :class="`w-full h-full flex flex-col items-center justify-center gap-5 p-4`">
            <span class="text-2xl">Create New Group</span>
            <input class="lg:w-1/2 w-full" type="text" placeholder="name" v-model="name">
            <span class="text-xl">Group Users</span>
            <button @click="addUserModal = !addUserModal" type="button" class="py-2 px-4 bg-gray-800 hover:bg-gray-700 duration-300 rounded-full flex flex-row items-center gap-1">
                <span>Add User</span>
                <i class="fa-solid fa-user-plus"></i>
            </button>
            <div class="flex flex-col overflow-auto gap-3">
                <div class="flex flex-row items-center gap-1 bg-gray-800/50 cursor-not-allowed duration-300 py-2 px-4 rounded-full">
                    <Profile :src="user.profilePhoto" width="32" height="32"/>
                    <span>{{ user.username }}</span>
                    <i class="fa-solid fa-user-minus"></i>
                </div>
                <div @click="deleteUser(user.id)" v-for="user in users" class="flex flex-row items-center gap-1 bg-gray-800 hover:bg-gray-700 cursor-pointer duration-300 py-2 px-4 rounded-full">
                    <Profile :src="user.profilePhoto" width="32" height="32"/>
                    <span>{{ user.username }}</span>
                    <i class="fa-solid fa-user-minus"></i>
                </div>
            </div>
            <button class="py-2 px-4 border-2 hover:bg-white hover:text-black duration-300 rounded-full">Create Group</button>
        </form>
    </div>
</template>
