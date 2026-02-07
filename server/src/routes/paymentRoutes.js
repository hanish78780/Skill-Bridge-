const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.dirname;
const r = express.Router();

// Initialize Razorpay
let razorpay;
try {
    if (process.env.RAZORPAY_KEY_ID && (process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET)) {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET
        });
    } else {
        console.warn('WARNING: Razorpay keys not found. Payment features will be disabled.');
    }
} catch (err) {
    console.warn('WARNING: Failed to initialize Razorpay:', err.message);
}

// @desc    Create Razorpay Order
// @route   POST /api/payment/order
// @access  Private
r.post('/order', protect, async (req, res) => {
    try {
        if (!razorpay) {
            return res.status(503).json({ message: 'Payment service is currently unavailable (Missing configuration)' });
        }

        const amount = 1; // Fixed amount: ₹1

        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}_${req.user.id.toString().slice(-4)}`,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        // Create transaction record
        await Transaction.create({
            user: req.user.id,
            orderId: order.id,
            amount: amount,
            status: 'created'
        });

        res.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount
        });
    } catch (error) {
        console.error('Razorpay Order Error:', error);
        res.status(500).json({
            message: 'Failed to create payment order',
            error: error.message,
            details: error.error // Razorpay often returns an 'error' object inside
        });
    }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
r.post('/verify', protect, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const secret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;
        if (!secret) throw new Error('Razorpay secret not configured');

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Update transaction status
            const transaction = await Transaction.findOne({ orderId: razorpay_order_id });
            if (transaction) {
                transaction.paymentId = razorpay_payment_id;
                transaction.status = 'success';
                await transaction.save();
            }

            // Grant project credit to user
            const user = await User.findById(req.user.id);
            user.projectCredits = (user.projectCredits || 0) + 1;
            await user.save();

            res.json({ status: 'success', message: 'Payment verified and credit added', credits: user.projectCredits });
        } else {
            // Update transaction as failed
            const transaction = await Transaction.findOne({ orderId: razorpay_order_id });
            if (transaction) {
                transaction.status = 'failed';
                await transaction.save();
            }

            res.status(400).json({ status: 'failed', message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({ message: 'Payment verification failed' });
    }
});

module.exports = r;
