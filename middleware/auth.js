export default defineNuxtRouteMiddleware(async(to,from) => {
    const user = useState("user");

    if(!process.server && !user.value) return navigateTo("/login");
});
