"use client"
import Script from 'next/script';
import React, { useState } from 'react';

const RazorpayPayment = () => {
    const [amount, setAmount] = useState('');

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const payNow = async () => {
        if (!amount) {
            alert('Please enter the amount.');
            return;
        }

        try {
            // Create order by calling the server endpoint
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: parseFloat(amount) * 100, // Convert to paise
                    productId: "6820fbe5a27ccf66c205008b",
                    variant: {
                        price: amount,
                        type:"POTRAIT",
                        lisence:"personal"
                    },
                    notes: {},
                }),
            });
            console.log(response)
            const order = await response.json();
            console.log("ye rha order",order)

            if (order && order.orderId) {
                const options = {
                    key: process.env.NEXT_PUBLIC_razorpay_id, // Use environment variable for key_id
                    amount: order.amount, // Amount from the backend order
                    currency: order.currency,
                    name: 'Your Company Name',
                    description: 'Secure Payment',
                    order_id: order.orderId, // Use the order ID from the backend
                    callback_url: `${window.location.origin}/dashboard?success=true`, // Use dynamic success URL
                    prefill: {
                        name: '', // You can prefill user details if available
                        email: '',
                        contact: '',
                    },
                    theme: {
                        color: '#3366FF',
                    },
                //     handler: async function (response) {
                //         // Verify the payment signature on the server
                //         const verificationResponse = await fetch('/api/webhook/razorpay', {
                //             method: 'POST',
                //             headers: {
                //                 'Content-Type': 'application/json',
                //             },
                //             body: JSON.stringify({
                //                 razorpay_order_id: response.razorpay_order_id,
                //                 razorpay_payment_id: response.razorpay_payment_id,
                //                 razorpay_signature: response.razorpay_signature,
                //             }),
                //         });

                //         const verificationData = await verificationResponse.json();

                //         if (verificationData.success) {
                //             alert('Payment successful! Order ID: ' + response.razorpay_order_id);
                //             // Redirect to a success page or update UI
                //             window.location.href = `/payment-success?order_id=${response.razorpay_order_id}&payment_id=${response.razorpay_payment_id}`;
                //         } else {
                //             alert('Payment failed: ' + verificationData.error);
                //             // Handle payment failure
                //         }
                //     },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                alert('Failed to create order.');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('An error occurred while processing your request.');
        }
    };

    return (
        <div>
            <h1>Razorpay Payment Gateway Integration</h1>
            <form id="payment-form">
                <label htmlFor="amount">Amount:</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    required
                />
                <button type="button" onClick={payNow}>
                    Pay Now
                </button>
            </form>
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
        </div>
    );
};

export default RazorpayPayment;