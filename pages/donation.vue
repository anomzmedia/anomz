<script setup>

    /*import useAPI from '~/composables/axios';

    const axios = useAPI();

    const charge = ref({});

    let email = ref("");
    let username = ref("");
    var request = ref(false);
    let amount = ref("");
    let success = ref(false);
    let error = ref(null);

    const stripe = Stripe("pk_test_51Hx7TJIyX1NxTDKlh6slKRBBCymMDyDvnVnNGuDh8P0ARfiRqtwGQEV7SzT1TLFhmZtOMK7NpT16ggcpe0D76ed200nlATdacs");
    const elements = stripe.elements();

    var style = {
        base: {
            color: "#fff",
            width:"100%"
        }
    };

    const card = elements.create('card',{style});

    onMounted(() => {
        //card.mount("#mainform");
    });

    const submit = async() => {
        request.value = true;

        let newStripe = await stripe.createToken(card);

        let res = await axios.post('/api/donation',{
            email:email.value,
            name:username.value,
            amount:amount.value,
            stripeToken:newStripe.token
        });

        request.value = false;

        let data = res.data;

        if(data.success) {
            charge.value = data.charge;
            return success.value = true;
        }

        error.value = data.message;
    };*/
</script>

<template>
    <!--<div class="w-2/3 h-full flex flex-col items-center pt-32" v-if="success">
        <div class="w-full flex flex-row gap-1 items-center text-2xl mb-4">
            <span class="font-bold">{{ String(charge.amount).slice(0,-2) }}</span>
            <span>{{charge.currency.toUpperCase()}}</span>
            <span class="text-sm bg-green-100 text-green-600 px-1 rounded">Succeeded</span>
        </div>
        <span class="hr"></span>
        <div class="w-full flex flex-row items-center justify-between">
            <div class="flex flex-col py-4">
                <span>Date</span>
                <span>{{new Date(Number(charge.created))}}</span>
            </div>
            <span class="hrt"></span>
            <div class="flex flex-col py-4">
                <span>Payment method</span>
                <span class="flex flex-row items-center gap-2"><svg class="SVGInline-svg SVGInline--cleaned-svg SVG-svg BrandIcon-svg BrandIcon--size--20-svg" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h32v32H0z" fill="#00579f"></path><g fill="#fff" fill-rule="nonzero"><path d="M13.823 19.876H11.8l1.265-7.736h2.023zm7.334-7.546a5.036 5.036 0 0 0-1.814-.33c-1.998 0-3.405 1.053-3.414 2.56-.016 1.11 1.007 1.728 1.773 2.098.783.379 1.05.626 1.05.963-.009.518-.633.757-1.216.757-.808 0-1.24-.123-1.898-.411l-.267-.124-.283 1.737c.475.213 1.349.403 2.257.411 2.123 0 3.505-1.037 3.521-2.641.008-.881-.532-1.556-1.698-2.107-.708-.354-1.141-.593-1.141-.955.008-.33.366-.667 1.165-.667a3.471 3.471 0 0 1 1.507.297l.183.082zm2.69 4.806.807-2.165c-.008.017.167-.452.266-.74l.142.666s.383 1.852.466 2.239h-1.682zm2.497-4.996h-1.565c-.483 0-.85.14-1.058.642l-3.005 7.094h2.123l.425-1.16h2.597c.059.271.242 1.16.242 1.16h1.873zm-16.234 0-1.982 5.275-.216-1.07c-.366-1.234-1.515-2.575-2.797-3.242l1.815 6.765h2.14l3.18-7.728z"></path><path d="M6.289 12.14H3.033L3 12.297c2.54.641 4.221 2.189 4.912 4.049l-.708-3.556c-.116-.494-.474-.633-.915-.65z"></path></g></g></svg> •••• {{charge.payment_method_details.card.last4}}</span>
            </div>
        </div>
        <span class="hr"></span>
        <div class="w-full flex flex-col py-4">
            <span class="text-2xl mb-3">Payment Details</span>
            <span>Amount: {{ String(charge.amount).slice(0,-2) }}</span>
            <span>Status: Succeeded</span>
        </div>
        <span class="hr"></span>
        <div class="w-full flex flex-col py-4">
            <span class="text-2xl mb-3">Payment Method</span>
            <span>Number: •••• {{charge.payment_method_details.card.last4}}</span>
            <span>Expires: {{ charge.payment_method_details.card.exp_month }}/{{ charge.payment_method_details.card.exp_year }}</span>
            <span>Type: {{ charge.payment_method_details.card.brand }}</span>
            <span>Issuer: null</span>
            <span>Postal code: {{ charge.billing_details.address.postal_code }}</span>
            <span>Origin: {{ charge.payment_method_details.card.country }}</span>
            <span>CVC check: Passed</span>
            <span>Zip check: Passed</span>
        </div>
    </div>
    <div v-else class="w-full h-full flex flex-col items-center pt-32">
        <h1 class="text-xl uppercase">Donation</h1>
        <form @submit.prevent="submit" class="w-full flex flex-row flex-wrap items-center justify-center p-4 gap-5" action="/donation" method="post">
            <input class="w-full" type="email" v-model="email" placeholder="email">
            <input class="w-full" type="text" v-model="username" placeholder="username">
            <input class="w-full" type="number" v-model="amount" placeholder="amount">
            <div id="mainform" class="w-full"></div>
            <Loading v-if="request"/>
            <button v-else class="bg-blue-600 py-2 px-4 rounded">submit</button>
        </form>
        <span>Or you can use this:</span>-->
    <div class="w-full h-full flex items-center justify-center">
        <a class="bg-blue-400 py-2 px-4 rounded-full mb-4 flex items-center justify-center" href="https://www.buymeacoffee.com/arasemr12" target="_blank">
            <img src="/bf.webp" draggable="false" width="512" alt="">
        </a>
    </div>
</template>
