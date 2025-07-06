const PDFDocument = require('pdfkit');
const MedicalRecord = require('../models/MedicalRecord');

exports.downloadPdf = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ user: req.user._id }).sort({ date: -1 });

    // Setup PDF response
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=medtrack-records.pdf');
    doc.pipe(res);

    doc.fontSize(22).text('MedTrack - Medical History Report', { align: 'center' });
    doc.moveDown();

    records.forEach((record, index) => {
      doc.fontSize(14).text(`Record #${index + 1}`);
      doc.text(`Title     : ${record.title}`);
      doc.text(`Type      : ${record.type}`);
      doc.text(`Date      : ${new Date(record.date).toDateString()}`);
      doc.text(`Notes     : ${record.notes || 'N/A'}`);
      doc.text(`File URL  : ${record.fileUrl || 'N/A'}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
