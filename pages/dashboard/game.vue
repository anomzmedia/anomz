<script setup>
import * as THREE from 'three';

const main = ref("");

const keys = ref({});

onMounted(() => {
    if(!process.client) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    main.value.appendChild( renderer.domElement );

    camera.position.z = 50;
    camera.position.y = 8;

    const geometry = new THREE.ConeGeometry( 3, 12, 3 ); 
    const material = new THREE.MeshBasicMaterial( {color: "blue"} );
    const cone = new THREE.Mesh(geometry, material ); scene.add( cone );
    scene.add(cone);

    let isJumping = false;

    const animate = () => {
        requestAnimationFrame( animate );

        //cone.rotation.x += 0.01;
        //cone.rotation.y += 0.01;

        if(keys.value["ArrowUp"]){
            cone.position.z -= 0.2;
        }

        if(keys.value["ArrowDown"]){
            cone.position.z += 0.2;
        }

        if(keys.value["ArrowRight"]){
            cone.position.x += 0.2;
        }

        if(keys.value["ArrowLeft"]){
            cone.position.x -= 0.2;
        }

        if(keys.value["Space"]){
            if(isJumping) return;
            cone.position.y += 2;
            isJumping = true;
        }

        if(isJumping){
            if(cone.position.y == 0 || cone.position.y < 0) {
                cone.position.y = 0;
                return isJumping = false;
            }
            else cone.position.y -= 0.05;
        }

        renderer.render( scene, camera );
    }

    animate();

    document.addEventListener('keydown',(e) => {
        keys.value[e.code] = true;
    });

    document.addEventListener('keyup',(e) => {
        keys.value[e.code] = false;
    });
});
</script>

<template>
    <div ref="main" class="w-full h-full"></div>
</template>