const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.checkout = async (req, res) => {
    try {
        const options = {
            amount: Number(req.body.amount * 100), // amount in the smallest currency unit
            currency: "INR",
        };
        const order = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Order creation failed",
        });
    }
};

exports.paymentVerification = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Database operations
            await Transaction.create({
                user: req.user.id,
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                amount: req.body.amount, // Ensure this is passed from frontend or retrieved from order
                status: 'success'
            });

            // Add credits to user
            // Assuming 1 Credit = 100 INR (Example logic)
            // Adjust based on your business logic
            // For now, let's just increment projectCredits by 1 for every successful transaction or based on amount
            const creditsToAdd = Math.floor(req.body.amount / 100);

            await User.findByIdAndUpdate(req.user.id, {
                $inc: { projectCredits: creditsToAdd }
            });

            res.status(200).json({
                success: true,
                reference: razorpay_payment_id
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid signature",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Payment verification failed",
        });
    }
};

exports.getApiKey = (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};
