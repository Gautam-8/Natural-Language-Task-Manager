import { GoogleGenerativeAI } from '@google/generative-ai';
import { Task } from '../types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

const generateTaskId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const extractTasksWithGemini = async (transcript: string): Promise<Task[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Extract tasks from the following meeting transcript. For each task, identify:
1. Description of the task
2. Who it's assigned to
3. The deadline
4. Priority level (P1-P5, where P1 is highest)

Format the response as a JSON array of tasks with these exact fields:
[{
  "description": "task description",
  "assignee": "person name",
  "deadline": "deadline in text",
  "priority": "P1/P2/P3/P4/P5"
}]

Meeting Transcript:
${transcript}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON array from the response using a more compatible regex
    const jsonMatch = text.match(/\[\s*{[\s\S]*}\s*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const extractedTasks = JSON.parse(jsonMatch[0]);

    // Add id and completed status to each task
    return extractedTasks.map((task: Omit<Task, 'id' | 'completed'>) => ({
      ...task,
      id: generateTaskId(),
      completed: false
    }));
  } catch (error) {
    console.error('Error extracting tasks with Gemini:', error);
    throw new Error('Failed to extract tasks from transcript');
  }
}; 