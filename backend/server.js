import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Favorite from "./models/favorite.js";

dotenv.config();

const app = express();
const PORT = 5001;

// connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

// middleware
app.use(cors());
app.use(express.json());

// TMDB setup
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// test route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// GET POPULAR MOVIES
app.get("/api/popular", async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}`
    );

    res.json(response.data.results);
  } catch (error) {
    console.error("Popular movies error:", error.message);
    res.status(500).json({ error: "Failed to fetch popular movies" });
  }
});

// SEARCH MOVIES
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.json([]);
    }

    const response = await axios.get(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    res.json(response.data.results);
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ error: "Failed to search movies" });
  }
});

app.use(cors());
app.use(express.json());

// GET favorites
app.get("/api/favorites", async (req, res) => {
  const favs = await Favorite.find();
  res.json(favs);
});

// POST favorites
app.post("/api/favorites", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const movie = req.body;

    const newFavorite = await Favorite.create(movie);

    res.json(newFavorite);
  } catch (err) {
    console.log("🔥 ERROR:", err); // 👈 THIS IS KEY
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

// DELETE favorites
app.delete("/api/favorites/:id", async (req, res) => {
  try {
    await Favorite.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete favorite" });
  }
});

//  start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log("API KEY loaded:", API_KEY ? "YES" : "NO");
});



