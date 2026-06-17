import express from 'express';

const router = express.Router();

// Mock Chatbot interaction since no Gemini API key is provided
router.post('/query', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Simple mock responses
  let reply = "I am SteelBot. I am currently in offline simulation mode.";
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('leave')) {
    reply = "To apply for leave, navigate to the 'Leave' section in your dashboard.";
  } else if (lowerMsg.includes('machine') || lowerMsg.includes('maintenance')) {
    reply = "If a machine is down, please report it immediately through the Maintenance module.";
  } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    reply = "Hello! How can I assist you with your operations today?";
  }

  // Simulate network delay
  setTimeout(() => {
    res.json({ reply });
  }, 800);
});

export default router;
