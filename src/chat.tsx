import OpenAI from "openai";

const LOCAL_STORAGE_KEY = "MYKEY";

export async function chat(answers: string[], assessmentType: string = "basic") {
  const storedKey = localStorage.getItem(LOCAL_STORAGE_KEY);
  const apiKey = storedKey ? JSON.parse(storedKey) : null;

  if (!apiKey) {
    throw new Error("OpenAI API key not found in localStorage.");
  }

  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  // Different system prompts based on assessment type
  const systemPrompt = assessmentType === "detailed" 
    ? `
      You are a professional career counselor with expertise in matching people with career paths. 
      Based on a user's detailed assessment answers, provide a comprehensive analysis of:
      1. Their ideal work environment and culture fit
      2. Specific career fields that match their preferences, motivations, and skills
      3. 3-5 specific job titles that would suit them particularly well
      4. Potential growth areas they might consider developing
      
      Be specific, insightful, and personalized. Use a professional yet encouraging tone.
      
      IMPORTANT: Format your response using proper markdown with clear section headers:
      - Use ## for main section headings
      - Use ### for subsection headings
      - Use bullet points (*) for lists
      - Use bold text (**text**) for emphasis
      - Organize the content with clear spacing between sections
      
      VERY IMPORTANT: In the job titles section, always format it as:
      ## Job Titles
      * First job title
      * Second job title
      * Third job title
      
      This exact format is required for proper processing.
    `
    : `
      You are a helpful and friendly career advisor. Based on a user's quiz answers, your job is to write a short, plain-language summary about the kinds of work environments, tasks, and strengths this person may enjoy.
      
      IMPORTANT: Please include at least one specific job title that matches their profile. You can mention it as "You might enjoy careers like [job title]" or similar phrasing.
      
      Keep the tone warm, supportive, and motivational.
      
      IMPORTANT: Format your response using proper markdown:
      - DO NOT use any heading that says "Career Exploration Summary" or similar
      - Start with a simple introduction paragraph without a heading
      - Use bullet points (*) to highlight key strengths or preferences 
      - Use bold text (**text**) sparingly for emphasis on important points
      - Keep the content concise but well-organized
      - Ensure you provide clear job title suggestions
    `;

  // Different user prompts based on assessment type
  const userPrompt = assessmentType === "detailed"
    ? `
      Here are the answers to a detailed career assessment:
      ${answers.join(", ")}

      Based on these answers, please provide a comprehensive career analysis with specific career suggestions.
    `
    : `
      Here are the answers to a basic career quiz:
      ${answers.join(", ")}

      Based on these answers, what types of careers or work styles might this person enjoy? Keep your response short and focused on their key strengths, but be sure to include at least one specific job title recommendation.
    `;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        }],
    });

    return completion.choices[0]?.message?.content;
  } catch (err: any) {
    if (err.status === 429) {
      throw new Error("Rate limit exceeded or no quota remaining. Check your OpenAI usage dashboard.");
    } else if (err.status === 401) {
      throw new Error("Invalid API key. Please double-check your key.");
    } else {
      throw new Error(`OpenAI error: ${err.message}`);
    }
  }
}

export async function generateJobImage(jobTitle: string) {
  const storedKey = localStorage.getItem(LOCAL_STORAGE_KEY);
  const apiKey = storedKey ? JSON.parse(storedKey) : null;

  if (!apiKey) {
    throw new Error("OpenAI API key not found in localStorage.");
  }

  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  try {
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: `A professional looking image representing a person working as a ${jobTitle}. The image should be clean, professional, and suitable for a career report. Show the person engaged in typical activities for this profession in their workplace.`,
      n: 1,
      size: "1024x1024",
    });

    if (response.data[0]?.url) {
      return response.data[0].url;
    }
    return null;
  } catch (error: any) {
    console.error("Error generating image:", error);
    return null;
  }
}

export function extractJobTitle(text: string, assessmentType: string = "basic"): string | null {
  // For detailed assessment, look for job titles section
  if (assessmentType === "detailed") {
    const jobTitleMatch = text.match(/(?:Job Titles:|Career Suggestions:|Recommended Jobs:|## [^#\n]*Job[^#\n]*|### [^#\n]*Job[^#\n]*)[:\s]*(?:\n|\r\n)(?:\*|-|\d+\.)\s*([^\n\r*]+)/i);
    
    if (jobTitleMatch && jobTitleMatch[1]) {
      return jobTitleMatch[1].trim();
    }
  }
  
  // For basic assessment or fallback
  const careerMatch = text.match(/(?:career|job|profession|occupation|role|position|path|field)[s]?(?:\s+like|\s+such as|\s+including|\s+in|\s+as a|:)\s+([^.,\n\r]+)/i);
  
  if (careerMatch && careerMatch[1]) {
    // Get the first suggested career/job title
    const careerSuggestion = careerMatch[1].trim()
      .replace(/^(?:a|an|the)\s+/i, '') // Remove leading articles
      .split(/\s+or\s+|\s+and\s+|,/)[0] // Take first item if multiple are listed
      .trim();
    
    return careerSuggestion;
  }
  
  return null;
}