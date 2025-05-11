import { generateCourse } from '../../lib/geminApi';
import { generateId } from '../../lib/utils';

export async function POST(request) {
    try {
      // Get request body
      const { courseTopic, difficultyLevel } = await request.json();
  
      // Validate input
      if (!courseTopic || !difficultyLevel) {
        console.error('Validation Error: Missing courseTopic or difficultyLevel');
        return Response.json(
          { error: 'Course topic and difficulty level are required' },
          { status: 400 }
        );
      }
  
      // Validate difficulty level
      const validDifficulties = ['beginner', 'intermediate', 'advanced'];
      if (!validDifficulties.includes(difficultyLevel)) {
        console.error('Validation Error: Invalid difficulty level');
        return Response.json(
          { error: 'Invalid difficulty level. Must be beginner, intermediate, or advanced' },
          { status: 400 }
        );
      }
  
      // Generate course content using Gemini AI
      const course = await generateCourse(courseTopic, difficultyLevel);
  
      // Log the generated course for debugging
      console.log('Generated Course:', JSON.stringify(course, null, 2));
  
      // Ensure all modules have IDs
      course.modules = course.modules.map(module => ({
        ...module,
        id: module.id || generateId()
      }));
  
      // Log the response being sent to the frontend
      const response = {
        success: true,
        courseSlug: course.slug,
        course,
      };
      console.log('Response to frontend:', response);
  
      // Return the response
      return Response.json(response);
    } catch (error) {
      console.error('Error generating course:', error);
  
      return Response.json(
        { error: 'Failed to generate course', details: error.message },
        { status: 500 }
      );
    }
  }