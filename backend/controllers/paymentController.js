const Payment = require("../models/Payment");

exports.makePayment = async (req, res) => {
  try {
    const payment = await Payment.create({
      user: req.user.id,
      booking: req.body.booking,
      amount: req.body.amount,
      status: "paid"
    });

    res.json(payment);

  } catch (err) {
    res.status(500).json({ msg: "Payment failed" });
  }
};