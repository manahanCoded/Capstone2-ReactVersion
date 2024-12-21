import OpenAI from "openai";
import env from "dotenv";

env.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

const getAiResponse = async (req, res) => {
  const { wrongAnswers } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: `In the wrongAnswers property, please explain why the answer for each question is wrong. Add an "explanation" property to each object, and kindly answer it in 2 or 3 sentences. Here's the array of wrong answers: ${JSON.stringify(
            wrongAnswers,
            null,
            2
          )}`,
        },
      ],
      model: 'gpt-4', // use gpt-4 (correct model name)
    });

    const apiResponse = completion.choices[0].message.content;


    // Try to parse the response into JSON
    const cleanedJsonString = apiResponse.match(/\[.*\]/s)?.[0];
    if (cleanedJsonString) {
      const jsonArray = JSON.parse(cleanedJsonString);
      res.json(jsonArray); // Send the response back to the frontend
    } else {
      res.status(500).json({ error: 'No valid JSON array found in response.' });
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



export { getAiResponse };
