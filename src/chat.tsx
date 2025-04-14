import OpenAI from "openai";

const LOCAL_STORAGE_KEY = "MYKEY";

export async function chat(answers: string[]) {
  const storedKey = localStorage.getItem(LOCAL_STORAGE_KEY);
  const apiKey = storedKey ? JSON.parse(storedKey) : null;

  if (!apiKey) {
    throw new Error("OpenAI API key not found in localStorage.");
  }

  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
            You are a helpful and friendly career advisor. Based on a user’s quiz answers, your job is to write a short, plain-language summary about the kinds of work environments, tasks, and strengths this person may enjoy. Avoid specific job titles. Instead, focus on general themes like collaboration, creativity, problem-solving, hands-on tasks, etc. Keep the tone warm, supportive, and motivational.
          `,
        },
        {
          role: "user",
          content: `
            Here are the answers to a basic career quiz:
            ${answers.join(", ")}
    
            Based on these answers, what types of careers or work styles might this person enjoy?
          `,
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