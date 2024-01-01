import pkg from "mongoose";
const { Schema, model, models } = pkg; // NOTE - CommonJS so gotta import it like this

const reminderSchema = new Schema({
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
  // messageId: {
  //   type: String,
  //   required: true,
  // },
  channelId: {
    type: String,
    required: true,
  },
});

export default models.reminderSchema || model("reminderSchema", reminderSchema);
