import Routine from '../models/routine.model.js';

export const getRoutine = async (req, res) => {
  try {
    let routine = await Routine.findOne();
    if (!routine) routine = await Routine.create({});
    res.json(routine);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch routine' });
  }
};

export const updateRoutine = async (req, res) => {
  try {
    let routine = await Routine.findOne();
    if (!routine) routine = await Routine.create({});
    routine.routineData = req.body.routineData || [];
    await routine.save();
    res.json(routine);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update routine' });
  }
};
