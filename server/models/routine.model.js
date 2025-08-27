import mongoose from 'mongoose';

const RoutineClassSchema = new mongoose.Schema({
  id: String,
  batchIndex: Number,
  dayIndex: Number,
  timeIndex: Number,
  course: String,
  teacher: String,
  room: String,
  // type: String,
}, { _id: false });

const RoutineSchema = new mongoose.Schema({
  routineData: { type: [RoutineClassSchema], default: [] },
}, { timestamps: true });

export default mongoose.model('Routine', RoutineSchema);
