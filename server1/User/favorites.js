const express = require("express");
const router = express.Router();
const FavoriteBus = require("../Module/FavoriteBus");

// ✅ Add Favorite Bus
router.post("/add", async (req, res) => {
  const { userId, busRouteNo } = req.body;

  try {
    const existingFav = await FavoriteBus.findOne({ userId, busRouteNo });

    if (existingFav) {
      return res.status(400).json({ message: "Bus already in favorites" });
    }

    const newFavorite = new FavoriteBus({ userId, busRouteNo });
    await newFavorite.save();

    res.status(201).json({ message: "Bus added to favorites", newFavorite });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Remove Favorite Bus
router.post("/remove", async (req, res) => {
  const { userId, busRouteNo } = req.body;

  try {
    await FavoriteBus.findOneAndDelete({ userId, busRouteNo });

    res.json({ message: "Bus removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get User's Favorite Buses
router.get("/:userId", async (req, res) => {
  try {
    const favoriteBuses = await FavoriteBus.find({ userId: req.params.userId });

    res.json(favoriteBuses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
