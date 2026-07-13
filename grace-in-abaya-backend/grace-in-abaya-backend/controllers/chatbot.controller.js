const { getChatbotReply } = require('../services/chatbot.service');

/**
 * POST /api/chatbot/chat
 * Body: { history: [{ role, content }] }
 *
 * The frontend maintains the conversation history and sends the full array
 * each time. This keeps the backend stateless.
 */
exports.chat = async (req, res) => {
  try {
    const { history } = req.body;

    if (!history || !Array.isArray(history) || history.length === 0)
      return res.status(400).json({ success: false, message: 'Message history is required.' });

    // Basic validation — last message must be from user
    const lastMessage = history[history.length - 1];
    if (lastMessage.role !== 'user')
      return res.status(400).json({ success: false, message: 'Last message must be from the user.' });

    const reply = await getChatbotReply(history);

    res.json({
      success: true,
      reply,
      role: 'assistant',
    });
  } catch (err) {
    console.error('Chatbot error:', err.message);
    res.status(500).json({ success: false, message: 'Chatbot is unavailable. Please try again.' });
  }
};
