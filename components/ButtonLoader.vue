<script setup>

const {size,color,speed,bgOpacity,active} = defineProps(['size','color','speed','bgOpacity','active']);

</script>

<style lang="scss" scoped>

$size: v-bind(size);
$color: v-bind(color);
$speed: v-bind(speed);
$bg-opacity: v-bind(bgOpacity);
$active: v-bind(active);

.container{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    flex-shrink:0;
    height:0;
    width:0;
}:host([hidden]){
    display:none
}

.container{
    animation:rotate $speed linear infinite;
    overflow:visible;
    transform-origin:center;
    will-change:transform;
}

.active{
    height:$size;
    width:$size;
}

.car{
    stroke:$color;
    stroke-dasharray:1,200;
    stroke-dashoffset:0;
    stroke-linecap:round;
    animation:stretch calc($speed*0.75) ease-in-out infinite;
    will-change:stroke-dasharray,stroke-dashoffset
}

.car,
.track{
    fill:none;
    transition:stroke 0.5s ease
}

.track{
    stroke: $color;
    opacity: $bg-opacity
}

@keyframes rotate{
    to{
        transform:rotate(1turn)
    }
}

@keyframes stretch{
    0%{
        stroke-dasharray:0,150;
        stroke-dashoffset:0
    }
    
    50%{
        stroke-dasharray:75,150;
        stroke-dashoffset:-25
    }
    
    to{
        stroke-dashoffset:-99
    }
}
      
</style>

<template>
    <svg :class="`container loader transition-all duration-300 ${active ? `active mr-2` : 'w-0 h-0 mr-0'}`" viewBox="0 0 50 50" height="50" width="50">
        <circle class="track" cx="25" cy="25" r="22" pathLength="100" stroke-width="6px" fill="none"></circle>
        <circle class="car" cx="25" cy="25" r="22" pathLength="100" stroke-width="6px" fill="none"></circle>
    </svg>
</template>
