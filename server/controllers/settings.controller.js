import Settings from '../models/settings.model.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    console.log('Received settings update:', req.body);
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    settings.teachers = req.body.teachers || [];
    settings.courses = req.body.courses || [];
    settings.rooms = req.body.rooms || [];
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
};
