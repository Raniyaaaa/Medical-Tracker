const MedicalRecord = require('../models/MedicalRecord');
const uploadToS3 = require('../utils/s3Upload');

exports.addRecord = async (req, res) => {
  try {
    const { title, type, notes } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const file = req.file;

    const fileUrl = await uploadToS3(file.buffer, file.originalname, file.mimetype);

    const newRecord = new MedicalRecord({
      user: req.user._id,
      title,
      type,
      notes,
      fileUrl,
      fileName: file.originalname,
    });

    const saved = await newRecord.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ user: req.user._id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record || record.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ msg: 'Record not found or unauthorized' });
    }
    await record.remove();
    res.json({ msg: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
