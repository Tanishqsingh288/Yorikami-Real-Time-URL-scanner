const Feedback = require('./model');
exports.submitFeedback = async (req, res) => {
  try {
    const { content, source } = req.body;

    // Simple validation
    if (!content || !source) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both content and source (email)',
      });
    }

    // Create feedback
    const feedback = await Feedback.create({ content, source });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};
