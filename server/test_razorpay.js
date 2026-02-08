const Razorpay = require('razorpay');
require('dotenv').config();

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

console.log(`Testing Razorpay with:`);
console.log(`Key ID: '${key_id}'`);
console.log(`Key Secret length: ${key_secret ? key_secret.length : 0}`);

if (!key_id || !key_secret) {
    console.error("Missing keys!");
    process.exit(1);
}

const instance = new Razorpay({
    key_id: key_id,
    key_secret: key_secret,
});

async function test() {
    try {
        const options = {
            amount: 50000,
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        console.log("Success! Order created:", order.id);
    } catch (error) {
        console.error("Error creating order:", error);
    }
}

test();
