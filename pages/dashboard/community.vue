<script setup>

    import * as THREE from 'three';

    const webGl = ref();
    const mouse = ref(false);
    const mousePosition = ref(null);
    const firstMousePosition = ref(null);

    const cubes = ref([]);
    
    onMounted(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
        const renderer = new THREE.WebGLRenderer({canvas:webGl.value,antialias:true});

        renderer.setSize( window.innerWidth, window.innerHeight );

        const geometry = new THREE.SphereGeometry( 1, 50, 50 );
        const material = new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load("/earth2.jpg"),
        });

        for (let i = 0; i < 20; i++) { 
            const cube = new THREE.Mesh( geometry, material );

            let x = Math.floor((Math.random()*18)-9);            
            let y = Math.floor((Math.random()*8)-4);            
            let z = Math.floor(Math.random()*-10);
            cube.position.x = x;
            cube.position.y = y;
            cube.position.z = z;

            cubes.value.push(cube);
            scene.add(cube);
            cube.speed = Math.random()*0.05;
        }

        camera.position.z = 5;
        
        const light = new THREE.PointLight(0xffffff, 1);

        light.position.set(150, 150, 150);
        scene.add(light);

        const animate = () => {
            requestAnimationFrame(animate);
            cubes.value.forEach(async(cube) => {
                cube.rotation.x+=cube.speed;
                cube.rotation.y+=cube.speed;
            });
            renderer.render(scene, camera);
        };

        animate();

        window.onwheel = (e) => {
            camera.position.z += e.deltaY/2500;
        };


        window.onmousedown = () => {
            mouse.value = true;
        };

        window.onmouseup = () => {
            mouse.value = false;
        };

        window.onmousemove = (e) => {
            if(!mouse.value) return;
            mousePosition.value = {x:e.clientX,y:e.clientY};
            if(!firstMousePosition.value) firstMousePosition.value = mousePosition.value;

            let xDiff = mousePosition.value.x - firstMousePosition.value.x;
            let yDiff = mousePosition.value.y - firstMousePosition.value.y;

            camera.position.x += xDiff/500;
            camera.position.y -= yDiff/500;

            firstMousePosition.value = mousePosition.value;

            console.log(mousePosition.value.x - firstMousePosition.value.x);
        };
    });
</script>

<template>
    <div :style="`cursor: ${mouse ? 'grabbing' : 'grab'};`" class="w-full h-full flex items-center justify-center">
        <canvas class="w-full h-full fixed top-0 left-0 z-10" ref="webGl"></canvas>
        <div class="z-50 w-2/3 h-2/3 py-2 px-4 rounded-lg flex flex-col items-center bg-opacity-30">
            <h1 class="bg-gradient-to-tr from-purple-600 to-blue-600 bg-clip-text text-transparent text-4xl">Community</h1>
        </div>
    </div>
</template>