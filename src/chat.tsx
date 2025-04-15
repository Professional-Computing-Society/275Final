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
    `
    : `
      You are a helpful and friendly career advisor. Based on a user's quiz answers, your job is to write a short, plain-language summary about the kinds of work environments, tasks, and strengths this person may enjoy. Avoid specific job titles. Instead, focus on general themes like collaboration, creativity, problem-solving, hands-on tasks, etc.
      
      Keep the tone warm, supportive, and motivational.
      
      IMPORTANT: Format your response using proper markdown:
      - DO NOT use any heading that says "Career Exploration Summary" or similar
      - Start with a simple introduction paragraph without a heading
      - Use bullet points (*) to highlight key strengths or preferences 
      - Use bold text (**text**) sparingly for emphasis on important points
      - Keep the content concise but well-organized
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

      Based on these answers, what types of careers or work styles might this person enjoy? Keep your response short and focused on their key strengths.
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