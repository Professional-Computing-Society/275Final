import OpenAI from "openai";

const LOCAL_STORAGE_KEY = "MYKEY";

export async function chat(content: string) {
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
          role: "user",
          content,
        },
      ],
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