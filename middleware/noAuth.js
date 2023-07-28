import { useAuth } from "~/composables/auth";

export default defineNuxtRouteMiddleware(async(to,from) => {
    let user = await useAuth();
    if(user) return navigateTo("/dashboard");
});
