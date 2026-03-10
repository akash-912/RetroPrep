import { useState } from 'react';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
    dangerouslyAllowBrowser: true,
});

export function useDoubtSolver() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const solveDoubt = async (subject, question) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!import.meta.env.VITE_GROQ_API_KEY) {
                throw new Error("Groq API key is not configured in .env");
            }

            const response = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert academic tutor specializing in ${subject}. 
Explain concepts clearly with examples. Use numbered lists, bullet points, and clear headings to structure your response.
Be thorough but concise.`,
                    },
                    {
                        role: 'user',
                        content: question,
                    },
                ],
                temperature: 0.6,
            });

            const answer = response.choices[0].message.content.trim();
            setIsLoading(false);
            return answer;

        } catch (err) {
            console.error("Failed to solve doubt:", err);
            setError(err.message || 'An error occurred while fetching the answer.');
            setIsLoading(false);
            return null;
        }
    };

    return { solveDoubt, isLoading, error };
}
