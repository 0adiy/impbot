import { Schema, model, models } from "mongoose";

const favPlaylistSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  reminder: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
});

export default models.favPlaylist || model("favPlaylist", favPlaylistSchema);
