<script setup>
import "aos/dist/aos.css";

import AOS from "aos";

const user = useState("user");
const token = useCookie("token");

const { public: { apiUrl } } = useRuntimeConfig();

const route = useRoute();

(async () => {
  if (!token.value) return;

  let { data } = await useFetch(`${apiUrl}/api/auth/me`, {
    headers: {
      Authorization: token.value
    }
  });

  if (!data.value || !data.value.success) return token.value = null;
  user.value = data.value.user;
})();

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js", {
        scope: "/",
      });
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

onMounted(() => {
  AOS.init();

  registerServiceWorker();
});

</script>

<template>
  <div class="w-full h-full">
    <Navbar v-if="!route.path.includes('dashboard')" />
    <mobile-navbar v-if="!route.path.includes('dashboard')" />
    <div class="w-full h-full">
      <slot />
    </div>
  </div>
</template>
