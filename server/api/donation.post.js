import stripe from "stripe";

let {stripePrivateKey} = useRuntimeConfig();

const Stripe = new stripe(stripePrivateKey);

export default defineEventHandler(async(event) => {
    try {
        let {email,name,amount,stripeToken} = await readBody(event);
        if(!email || !name || !amount || !stripeToken) return {success:false,message:"Body err!"};
    
        let customer = await Stripe.customers.create({
            name,
            email,
            source:stripeToken.id
        });
    
        let charge = await Stripe.charges.create({
            amount:amount*100,
            currency:"usd",
            customer:customer.id
        });

        Stripe.customers.del(customer.id);
    
        return {success:true,customer,charge};
    } catch (error) {
        console.log(error.message)
        return {success:false,message:error.message}
    }
});
