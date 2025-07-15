const Reminder = require('../models/Reminder');

exports.addReminder = async (req, res) => {
  try {
    const { title, type, date, time, note } = req.body;

    const reminder = await Reminder.create({
      user: req.user._id,
      title,
      type,
      date,
      time,
      note
    });

    res.status(201).json(reminder);
  } catch (err) {
    console.error("Error adding reminder:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder
      .find({ user: req.user._id }).sort({ date: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReminderById = async (req, res) => {
  try {
    const reminder = await Reminder
      .findById(req.params.id);
    if (!reminder) return res.status(404).json({ error: 'Not found' });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const updated = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500)
      .json({ error: err.message });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
