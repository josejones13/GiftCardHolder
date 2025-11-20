const mongoose = require("mongoose");

const giftCardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cardBrand: String,
  cardNumber: String,
  balance: Number,
  expiryDate: String,
  notes: String,
  dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GiftCard", giftCardSchema);