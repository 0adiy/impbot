import pkg from "mongoose";
const { Schema, model, models } = pkg; // NOTE - CommonJS so gotta import it like this

const taskSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    required: false,
    default: false,
  },
});

export default models.taskSchema || model("taskSchema", taskSchema);
