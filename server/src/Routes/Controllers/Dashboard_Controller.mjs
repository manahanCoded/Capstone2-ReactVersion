import OpenAI from "openai";
import env from "dotenv";
import db from "../../Database/DB_Connect.mjs";

env.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getAiResponse = async (req, res) => {
  const { wrongAnswers } = req.body;

  if (!Array.isArray(wrongAnswers)) {
    return res.status(400).json({ error: "wrongAnswers must be an array" });
  }

  try {
    const moduleTitles = wrongAnswers.map((answer) => answer.module_title);
    const query = `
  SELECT m.id AS module_id, 
         q.question_text, 
         q.option_a, 
         q.option_b, 
         q.option_c, 
         q.option_d, 
         q.correct_option
  FROM module m
  INNER JOIN questions q ON m.id = q.module_title
  WHERE m.title = $1
`;

    const { rows: questions } = await db.query(query, [moduleTitles]);


    const enrichedAnswers = wrongAnswers.map((wrongAnswer) => {
      const question = questions.find((q) => q.module_title === wrongAnswer.module_title);
      if (!question) {
        return { ...wrongAnswer, error: "Question not found in database." };
      }
      
      const correctAnswerText = question[`option_${question.correct_option.toLowerCase()}`];
      const userAnswerText = question[`option_${wrongAnswer.user_answer.toLowerCase()}`];

      return {
        ...wrongAnswer,
        module_id: question.module_id,
        correct_answer_text: correctAnswerText,
        user_answer_text: userAnswerText,
      };
    });



    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: `In the wrongAnswers property, explain why the answer for each question is wrong. Add an "explanation" property to each object, and answer it in 4 or more sentences comparing answers. Here's the array of wrong answers: ${JSON.stringify(
            enrichedAnswers,
            null,
            2
          )}`,
        },
      ],
      model: 'gpt-4',
    });

    const apiResponse = completion.choices[0].message.content;

    // Try to parse the response into JSON
    const cleanedJsonString = apiResponse.match(/\[.*\]/s)?.[0];

    if (cleanedJsonString) {
      const jsonArray = JSON.parse(cleanedJsonString);
      res.json(jsonArray);
    } else {
      res.status(500).json({ error: 'No valid JSON array found in response.' });
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { getAiResponse };
