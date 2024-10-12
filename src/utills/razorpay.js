const Razorpay = require('razorpay');

const instance = new Razorpay({ key_id: 'rzp_live_TjoyObMsaNibqV', key_secret: 'YmjLEKvIIKK33x9O25V4IkUK' })
// const instance = new Razorpay({ key_id: 'rzp_test_cfXgi2vqOS38cq', key_secret: 'DnCxbfWPShA6eJJfiWwgr1fC' })

module.exports = instance;