import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/webhook', async (req, res) => {
  const userQuery = req.body.queryResult?.queryText || "Hello";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(userQuery);
    const reply = result.response.text();

    res.json({
      fulfillmentText: reply,
    });
  } catch (error) {
    console.error(error);
    res.json({
      fulfillmentText: "Sorry, I couldn’t get that. Try again!",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook running on port ${PORT}`));
