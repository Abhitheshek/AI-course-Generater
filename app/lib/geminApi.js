import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI("AIzaSyArlkCUHxkzWPRpIib76wu46rpNwuW2XTA");

// Get the generative model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// YouTube API key - you'll need to get one from Google Cloud Console
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "AIzaSyBp3rWVwwzVM6IBxxogqXmLlq5mXkEwHRo";

// Function to get module-specific videos
export async function getModuleVideos(moduleTitle) {
  try {
    // Search for videos related to the module title
    const videos = await searchYouTubeVideos(`${moduleTitle} tutorial`, 3);
    return videos;
  } catch (error) {
    console.error("Error fetching module videos:", error);
    // Return fallback videos if the search fails
    return [
      {
        title: "Introduction to Programming - Full Course",
        url: "https://youtube.com/watch?v=zOjov-2OZ0E",
        thumbnail: "https://i.ytimg.com/vi/zOjov-2OZ0E/hqdefault.jpg",
        channelTitle: "freeCodeCamp.org",
        publishedAt: "2022-01-01T00:00:00Z"
      },
      {
        title: "Learn Data Science Tutorial - Full Course for Beginners",
        url: "https://youtube.com/watch?v=ua-CiDNNj30",
        thumbnail: "https://i.ytimg.com/vi/ua-CiDNNj30/hqdefault.jpg",
        channelTitle: "freeCodeCamp.org",
        publishedAt: "2022-01-01T00:00:00Z"
      },
      {
        title: "Machine Learning for Everybody – Full Course",
        url: "https://youtube.com/watch?v=i_LwzRVP7bg",
        thumbnail: "https://i.ytimg.com/vi/i_LwzRVP7bg/hqdefault.jpg",
        channelTitle: "freeCodeCamp.org",
        publishedAt: "2022-01-01T00:00:00Z"
      }
    ];
  }
}

// Function to search YouTube for relevant videos
async function searchYouTubeVideos(query, maxResults = 3) {
  try {
    const searchParams = new URLSearchParams({
      part: 'snippet',
      q: query,
      maxResults: maxResults,
      key: YOUTUBE_API_KEY,
      type: 'video',
      videoDefinition: 'high',
      relevanceLanguage: 'en',
      publishedAfter: '2022-01-01T00:00:00Z', // Videos published after 2022
      order: 'relevance'
    });

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams}`);
    const data = await response.json();

    if (!response.ok) {
      console.error("YouTube API error:", data);
      throw new Error("Failed to fetch videos from YouTube");
    }

    if (!data.items || data.items.length === 0) {
      throw new Error("No videos found");
    }

    return data.items.map(item => ({
      title: item.snippet.title,
      url: `https://youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));
  } catch (error) {
    console.error("Error searching YouTube:", error);
    throw error;
  }
}

// Helper function to safely parse JSON with better error handling
function safeJsonParse(text) {
  try {
    // First try direct parsing
    return JSON.parse(text);
  } catch (e) {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*\n([\s\S]*?)\n```/) || text.match(/({[\s\S]*})/);
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (innerError) {
        console.error("Error parsing extracted JSON:", innerError);
      }
    }
    
    // Try to clean the text and parse again
    try {
      // Replace common issues that break JSON parsing
      const cleanedText = text
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
        .replace(/\\(?!["\\/bfnrt])/g, "\\\\") // Escape backslashes
        .replace(/(?<!\\)"/g, '\\"') // Escape unescaped quotes
        .replace(/\n/g, "\\n") // Replace newlines
        .replace(/\r/g, "\\r") // Replace carriage returns
        .replace(/\t/g, "\\t"); // Replace tabs
      
      // Try to find the JSON object in the cleaned text
      const jsonObjectMatch = cleanedText.match(/{[\s\S]*}/);
      if (jsonObjectMatch) {
        return JSON.parse(jsonObjectMatch[0]);
      }
    } catch (cleanError) {
      console.error("Error parsing cleaned JSON:", cleanError);
    }
    
    // If all else fails, throw the original error
    throw new Error(`Failed to parse JSON: ${e.message}`);
  }
}

// Function to generate a fallback course structure
async function generateFallbackCourse(courseTitle, difficultyLevel) {
  // Hardcoded sample videos that are known to exist
  const sampleVideos = [
    {
      title: "Introduction to Programming - Full Course",
      url: "https://youtube.com/watch?v=zOjov-2OZ0E"
    },
    {
      title: "Learn Data Science Tutorial - Full Course for Beginners",
      url: "https://youtube.com/watch?v=ua-CiDNNj30"
    },
    {
      title: "Machine Learning for Everybody – Full Course",
      url: "https://youtube.com/watch?v=i_LwzRVP7bg"
    }
  ];

  const fallbackPrompt = `
    Create a comprehensive course outline for "${courseTitle}" at the ${difficultyLevel} level.
    
    Return the response as a JSON object with the following structure:
    {
      "title": "Full course title",
      "description": "Brief course description",
      "difficultyLevel": "${difficultyLevel}",
      "modules": [
        {
          "title": "Module 1 Title",
          "briefDescription": "Brief description of this module content"
        }
      ]
    }
    
    Ensure there are at least 5-8 modules that cover the topic comprehensively.
  `;

  const fallbackResult = await model.generateContent(fallbackPrompt);
  const fallbackResponse = await fallbackResult.response;
  const fallbackText = fallbackResponse.text();
  
  try {
    const courseData = safeJsonParse(fallbackText);
    // Add the sample videos
    return {
      ...courseData,
      recommendedVideos: sampleVideos
    };
  } catch (e) {
    console.error("Failed to parse fallback course:", e);
    
    // Return a minimal valid structure if all else fails
    return {
      title: courseTitle,
      description: `A ${difficultyLevel} level course on ${courseTitle}`,
      difficultyLevel: difficultyLevel,
      modules: [
        {
          title: "Introduction to " + courseTitle,
          briefDescription: "An overview of the course content and objectives."
        },
        {
          title: "Core Concepts",
          briefDescription: "Fundamental principles and key ideas."
        },
        {
          title: "Advanced Topics",
          briefDescription: "More complex subjects and in-depth analysis."
        }
      ],
      recommendedVideos: sampleVideos
    };
  }
}

export async function generateCourse(courseTitle, difficultyLevel) {
  return generateCourseContent(courseTitle, difficultyLevel);
}

export async function generateCourseContent(courseTitle, difficultyLevel) {
  try {
    // First, generate the course structure without videos
    const prompt = `
      Create a comprehensive course outline for "${courseTitle}" at the ${difficultyLevel} level.
      
      Return the response as a JSON object with the following structure:
      {
        "title": "Full course title",
        "description": "Brief course description",
        "difficultyLevel": "${difficultyLevel}",
        "modules": [
          {
            "title": "Module 1 Title",
            "briefDescription": "Brief description of this module content"
          }
        ],
        "videoTopics": [
          "Specific topic for video recommendation 1 related to this course",
          "Specific topic for video recommendation 2 related to this course",
          "Specific topic for video recommendation 3 related to this course"
        ]
      }
      
      Ensure there are at least 5-8 modules that cover the topic comprehensively.
      For videoTopics, provide 3 specific search queries that would help find relevant educational videos for this course.
      Make these queries specific and targeted to find high-quality educational content.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Use the safe JSON parser
    let courseStructure;
    try {
      courseStructure = safeJsonParse(text);
    } catch (e) {
      console.error("Failed to parse course structure:", e);
      return generateFallbackCourse(courseTitle, difficultyLevel);
    }
    
    // Ensure videoTopics exists
    if (!courseStructure.videoTopics || !Array.isArray(courseStructure.videoTopics) || courseStructure.videoTopics.length === 0) {
      courseStructure.videoTopics = [
        `${courseTitle} tutorial`,
        `${courseTitle} for ${difficultyLevel}s`,
        `learn ${courseTitle}`
      ];
    }
    
    // Now fetch real YouTube videos based on the generated topics
    let recommendedVideos = [];
    try {
      const videoPromises = courseStructure.videoTopics.map(topic => 
        searchYouTubeVideos(`${courseTitle} ${topic}`, 1)
      );
      
      const videoResults = await Promise.all(videoPromises);
      recommendedVideos = videoResults.flat().slice(0, 3); // Ensure we have max 3 videos
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      // Fall back to hardcoded videos if YouTube API fails
      recommendedVideos = [
        {
          title: "Introduction to Programming - Full Course",
          url: "https://youtube.com/watch?v=zOjov-2OZ0E"
        },
        {
          title: "Learn Data Science Tutorial - Full Course for Beginners",
          url: "https://youtube.com/watch?v=ua-CiDNNj30"
        },
        {
          title: "Machine Learning for Everybody – Full Course",
          url: "https://youtube.com/watch?v=i_LwzRVP7bg"
        }
      ];
    }
    
    // Create the final course content with real videos
    const finalCourseContent = {
      ...courseStructure,
      recommendedVideos: recommendedVideos.map(video => ({
        title: video.title,
        url: video.url
      }))
    };
    
    // Remove the videoTopics field as it was just for internal use
    delete finalCourseContent.videoTopics;
    
    return finalCourseContent;
  } catch (error) {
    console.error("Error generating course content:", error);
    return generateFallbackCourse(courseTitle, difficultyLevel);
  }
}

export async function getModuleDetails(moduleTitle) {
  try {
    const prompt = `
      Create detailed content for the module titled "${moduleTitle}".
      
      Return the response as a JSON object with the following structure:
      {
        "title": "${moduleTitle}",
        "detailedContent": "Detailed HTML content of the module with proper formatting, headings, paragraphs, and possibly code examples if relevant",
        "exercises": [
          { "title": "Exercise 1 Title", "description": "Description of the exercise" },
          { "title": "Exercise 2 Title", "description": "Description of the exercise" }
        ],
        "resources": [
          { "title": "Resource Name", "url": "https://example.com/resource" }
        ]
      }
      
      For the "detailedContent" field, include well-formatted HTML with:
      - Proper heading structure (h2, h3, etc.)
      - Paragraphs with clear explanations
      - Lists (ordered or unordered) when appropriate
      - Code examples if relevant (using <pre><code> tags)
      - Bold or italic emphasis for important terms
      - Any diagrams should be described textually
      
      Include 2-3 practical exercises related to the module.
      Include 3-5 additional learning resources with proper URLs.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Use the safe JSON parser
    try {
      return safeJsonParse(text);
    } catch (e) {
      console.error("Failed to parse module details:", e);
      
      // Return a minimal valid structure if parsing fails
      return {
        title: moduleTitle,
        detailedContent: `<h2>Introduction to ${moduleTitle}</h2><p>This module covers the key concepts and principles of ${moduleTitle}.</p>`,
        exercises: [
          { title: "Practice Exercise", description: "Apply the concepts learned in this module to solve a real-world problem." }
        ],
        resources: [
          { title: "Additional Reading", url: "https://example.com/resources" }
        ]
      };
    }
  } catch (error) {
    console.error("Error generating module details:", error);
    
    // Return a minimal valid structure if all else fails
    return {
      title: moduleTitle,
      detailedContent: `<h2>Introduction to ${moduleTitle}</h2><p>This module covers the key concepts and principles of ${moduleTitle}.</p>`,
      exercises: [
        { title: "Practice Exercise", description: "Apply the concepts learned in this module to solve a real-world problem." }
      ],
      resources: [
        { title: "Additional Reading", url: "https://example.com/resources" }
      ]
    };
  }
}