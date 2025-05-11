// app/lib/quizService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "YOUR_API_KEY_HERE");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateQuiz(moduleTitle, moduleDescription, difficultyLevel) {
  try {
    const prompt = `
      Create a comprehensive quiz about "${moduleTitle}".
      
      The quiz should test knowledge on the following topic:
      ${moduleDescription}
      
      Return the response as a JSON object with the following structure:
      {
        "title": "Quiz title related to the module",
        "description": "Brief description of what this quiz covers",
        "questions": [
          {
            "question": "Question text here?",
            "type": "multiple-choice", // or "true-false"
            "options": ["Option A", "Option B", "Option C", "Option D"], // Include for multiple-choice
            "correctAnswer": "Option A", // The correct answer
            "explanation": "Brief explanation of why this is the correct answer"
          },
          // More questions...
        ]
      }
      
      Create 10 questions total:
      - 7 multiple-choice questions with 4 options each
      - 3 true-false questions with options ["True", "False"]
      
      Make sure the questions cover different aspects of the topic and vary in difficulty.
      The difficulty level should be: ${difficultyLevel}.
      Ensure all questions are factually accurate and related to the topic.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/({[\s\S]*})/);
    let quizData;
    
    if (jsonMatch && jsonMatch[1]) {
      quizData = JSON.parse(jsonMatch[1]);
    } else {
      try {
        quizData = JSON.parse(text);
      } catch (e) {
        throw new Error("Failed to parse quiz data");
      }
    }
    
    return quizData;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
}
