import { useState } from 'react';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
    dangerouslyAllowBrowser: true,
});

export function useAnswerEvaluator() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const evaluateAnswer = async (question, userAnswer) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!import.meta.env.VITE_GROQ_API_KEY) {
                throw new Error("Groq API key is not configured in .env");
            }

            const prompt = `You are a strict but fair academic evaluator. Evaluate the student's answer to the following question.

Question: ${question}

Student's Answer: ${userAnswer}

Return the response AS A VALID JSON OBJECT ONLY. No markdown, no extra text.
The object must have exactly this structure:
{
  "score": <integer from 0 to 100>,
  "strengths": ["strength 1", "strength 2", ...],
  "improvements": ["improvement 1", "improvement 2", ...],
  "feedback": "A detailed paragraph explaining what was correct, what was wrong, and how the answer could be improved."
}`;

            const response = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert academic evaluator. Always respond with valid JSON only, no markdown.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.4,
            });

            let text = response.choices[0].message.content.trim();

            // Strip markdown code fences if present
            if (text.startsWith('```json')) {
                text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
            } else if (text.startsWith('```')) {
                text = text.replace(/^```\n/, '').replace(/\n```$/, '');
            }

            const result = JSON.parse(text);
            setIsLoading(false);
            return result;

        } catch (err) {
            console.error("Failed to evaluate answer:", err);
            setError(err.message || 'An error occurred while evaluating the answer.');
            setIsLoading(false);
            return null;
        }
    };

    return { evaluateAnswer, isLoading, error };
}
