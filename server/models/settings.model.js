import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  teachers: { type: [String], default: [] },
  courses: { type: [String], default: [] },
  rooms: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model('Settings', SettingsSchema);
