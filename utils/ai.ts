import OpenAI from "openai";

export async function AIFunction(description: string) {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            'You are an AI assistant that analyzes ticket descriptions and determines the most appropriate priority "LOW", "MEDIUM", "HIGH") for the ticket. In addition to the description and priority, you should also provide an array of relevant tech stack tags (such as "React", "Node.js", "PostgreSQL", etc.) that are applicable to the ticket. Respond ONLY with a JSON object in the following format: {"title": <short title based on the description> , "description": "<summary of the ticket>", "priority": "<low|medium|high>", "tags": ["<tag1>", "<tag2>", ...]}. Do not include any other text.',
        },
        {
          role: "user",
          content: `Ticket description: ${description}`,
        },
      ],
    });

    console.log("response:", response.choices[0].message);

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    throw error;
  }
}
