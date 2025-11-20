const express = require("express");
const router = express.Router();
const GiftCard = require("../models/GiftCard");

function requireAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

// READ — All cards
router.get("/", requireAuth, async (req, res) => {
  const cards = await GiftCard.find({ userId: req.user.id });
  res.render("cards/index", { cards });
});

// CREATE — New card form
router.get("/new", requireAuth, (req, res) => res.render("cards/new"));

// CREATE — Save new card
router.post("/", requireAuth, async (req, res) => {
  try {
    await GiftCard.create({
      userId: req.user.id,
      cardBrand: req.body.cardBrand,
      cardNumber: req.body.cardNumber,
      balance: req.body.balance,
      expiryDate: req.body.expiryDate,
      notes: req.body.notes,
    });
    res.redirect("/cards");
  } catch (err) {
    console.error(err);
    res.render("error", { errorMessage: "Failed to add gift card." });
  }
});

// UPDATE — Edit form
router.get("/:id/edit", requireAuth, async (req, res) => {
  const card = await GiftCard.findOne({ _id: req.params.id, userId: req.user.id });
  if (!card) return res.render("error", { errorMessage: "Card not found." });
  res.render("cards/edit", { card });
});

// UPDATE — Save changes
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const result = await GiftCard.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        cardBrand: req.body.cardBrand,
        cardNumber: req.body.cardNumber,
        balance: req.body.balance,
        expiryDate: req.body.expiryDate,
        notes: req.body.notes,
      }
    );
    if (!result) return res.render("error", { errorMessage: "Card not found." });
    res.redirect("/cards");
  } catch (err) {
    console.error(err);
    res.render("error", { errorMessage: "Failed to update card." });
  }
});

// DELETE — Remove card
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const result = await GiftCard.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!result) return res.render("error", { errorMessage: "Card not found." });
    res.redirect("/cards");
  } catch (err) {
    console.error(err);
    res.render("error", { errorMessage: "Failed to delete card." });
  }
});

module.exports = router;
