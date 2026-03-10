import { useState } from 'react';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
    dangerouslyAllowBrowser: true, // Required for client-side usage
});

export function useQuestionGenerator() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateQuestions = async (subject, examType, numQuestions) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!import.meta.env.VITE_GROQ_API_KEY) {
                throw new Error("Groq API key is not configured in .env");
            }

            const prompt = `You are an expert academic tutor. Generate a question paper for ${subject}.
The exam type is ${examType}.
Generate exactly ${numQuestions} distinct questions.

Return the response AS A VALID JSON ARRAY OF OBJECTS ONLY. No markdown, no extra text.
Each object must have this structure:
{
  "questionText": "The text of the question",
  "correctAnswer": "A concise explanation or answer to the question"
}`;

            const response = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert academic question paper generator. Always respond with valid JSON only, no markdown.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.7,
            });

            let text = response.choices[0].message.content.trim();

            // Strip markdown code fences if present
            if (text.startsWith('```json')) {
                text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
            } else if (text.startsWith('```')) {
                text = text.replace(/^```\n/, '').replace(/\n```$/, '');
            }

            const parsedQuestions = JSON.parse(text);
            if (!Array.isArray(parsedQuestions)) {
                throw new Error("Expected an array of questions from the AI.");
            }

            setIsLoading(false);
            return parsedQuestions;

        } catch (err) {
            console.error("Failed to generate questions:", err);
            setError(err.message || 'An error occurred while generating questions.');
            setIsLoading(false);
            return null;
        }
    };

    return { generateQuestions, isLoading, error };
}
