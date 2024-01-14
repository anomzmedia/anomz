<template>
    <div class="w-full h-full overflow-auto">
        <div class="w-full h-full flex flex-col items-center justify-center gap-y-3 text-center">
            <img src="/anomz2.png" width="96" draggable="false" alt="">
            <span class="font-bold uppercase text-4xl">Anomz</span>
            <span>Herkesin anonim olarak sohbet edebildiği özgürlükçü platform</span>
            <a href="https://www.producthunt.com/posts/anomz?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-anomz" target="_blank">
                <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=407824&theme=dark" alt="Anomz - Open&#0032;source&#0032;anonymous&#0032;social&#0032;media&#0046; | Product Hunt" style="width: 250px; height: 52px;" width="250" height="54" />
            </a>
            <button class="whtroundbtn opacity-50 cursor-not-allowed text-black flex flex-row items-center justify-center gap-1"><i class="fa-solid fa-download text-black"></i>Download</button>
            <nuxt-link class="roundbtn" to="/dashboard/">Open Anomz in your browser</nuxt-link>
            <a class="mt-8" href="#two">
                <i class="fa-solid fa-caret-down fa-2x text-gray-400 hover:text-white hover:-translate-y-[2px] duration-300"></i>
            </a>
        </div>
        <div class="w-full h-full flex items-center justify-center" id="two">
            <div class="w-full lg:w-3/4 h-full flex flex-col lg:flex-row items-center justify-center gap-3 p-4 lg:p-0">
                <a href="https://github.com/anomzmedia/anomz" target="_blank" class="flex flex-col items-center gap-1 bg-gray-800 p-4 rounded w-full lg:w-1/3">
                    <i class="fa-solid fa-lock fa-2x"></i>
                    <span class="text-xl font-bold">Open Source</span>
                    <!--<span>Open source and flexible hosting to enable data sovereignty.</span>-->
                </a>
                <div class="flex flex-col items-center gap-1 bg-gray-800 p-4 rounded w-full lg:w-1/3">
                    <i class="fa-solid fa-shield-halved fa-2x"></i>
                    <span class="text-xl font-bold">Security</span>
                    <!--<span>Open source and flexible hosting to enable data sovereignty.</span>-->
                </div>
                <div class="flex flex-col items-center gap-1 bg-gray-800 p-4 rounded w-full lg:w-1/3">
                    <i class="fa-solid fa-user-ninja fa-2x"></i>
                    <span class="text-xl font-bold">Anonymous</span>
                    <!--<span>Open source and flexible hosting to enable data sovereignty.</span>-->
                </div>
            </div>
        </div>
        <div class="w-full h-full hidden lg:flex items-center justify-center">
            <div class="w-full h-full lg:w-2/3 lg:h-2/3 flex items-center justify-center relative">
                <img src="/main2.png" class="w-full h-full rounded-lg" draggable="false" alt="">
                <img src="/main4.png" class="absolute h-full right-0 top-20" draggable="false" alt="">
            </div>
        </div>
    </div>
</template>