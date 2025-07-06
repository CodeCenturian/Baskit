import Coupon from '../models/coupon.model.js';
import Order from '../models/order.model.js';
import stripe from '../lib/stripe.js';

export const createCheckoutSesssion = async (req,res) => {
    const {products , couponCode} = req.body;

    if(!Array.isArray(products) || products.length ===0 ){
        return res.status(400).json({Error : "Empty products array"});
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

    let coupon = null;
    if(couponCode){
        coupon = await Coupon.findOne({code : couponCode , userId: req.user._id , isActive : true})
        if(coupon) totalAmount -= Math.round(totalAmount * coupon.discountPercentage) /100;
    }

    const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage),
						},
				  ]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

    if(totalAmount  > 200){
        await createNewCoupon(req.user._id);
    }

    res.status(200).json({id: session.id , totalAmount : totalAmount});

}

export const checkoutSuccess = async (req,res) => {
    try {
        const {session_id} = req.body;
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if(session.payment_status === "paid"){
            if(session.metadata.couponCode){
                await Coupon.findOneAndUpdate({
                    code : session.metadata.couponCode,
                    userId : req.user._id,
                },{
                    isActive : false
                })
            }
        }

        //create a new order
        const products = JSON.parse(session.metadata.products);
        const newOrder = new Order({
            userId : session.metadata.userId,
            products : products.map((product) => ({
                productId : product.id,
                quantity : product.quantity,
                price : (product.price).toFixed(2) // ensure price is in dollars, 2 decimals
            })),
            totalAmount : (session.amount_total / 100).toFixed(2), // convert cents to dollars, 2 decimals
            stripeSessionId : session.id,
        })

        await newOrder.save();

        res.status(200).json({
            success : true,
            message : "Payment successful, order created successfully and coupon deactivated if used",
            orderId : newOrder._id
        })

    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        duration : "once",
        percent_off : discountPercentage
    });

    return coupon.id;
}

async function createNewCoupon(userId) {
    const newCoupon = new Coupon({
        code : "GIFT"+Math.random().toString().slice(2,8).toUpperCase(),
        discountPercentage : 20,
        expirationDate : new Date(Date.now() + 7*24*60*60*1000), // 7 days
        userId : userId
    })

    await newCoupon.save();

    return newCoupon;
}

