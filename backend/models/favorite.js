import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  id: String,
  title: String,
  poster_path: String,
  release_date: String,
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;