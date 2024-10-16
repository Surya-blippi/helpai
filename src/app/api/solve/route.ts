import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const runtime = 'edge';

type ChatCompletion = OpenAI.Chat.Completions.ChatCompletion;
type ChatCompletionMessage = OpenAI.Chat.Completions.ChatCompletionMessage;

const formatInstructions = `
Format your response using the following guidelines:
1. Use markdown for basic formatting.
2. For inline math equations, use single dollar signs. Example: $E = mc^2$
3. For block math equations, use double dollar signs. Example:
   $$
   f(x) = \\int_{-\\infty}^\\infty \\hat f(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xi
   $$
4. Use LaTeX syntax for mathematical symbols and equations.
5. Number each step in your solution.
6. Provide brief explanations for each step.
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inputType, question, imageBase64 } = body;

    let response: ChatCompletion;
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('OpenAI API request timed out')), 25000)
    );

    if (inputType === 'text') {
      response = await Promise.race([
        openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              "role": "system",
              "content": `You are a helpful assistant that provides step-by-step solutions to math and science questions. ${formatInstructions}`
            },
            {
              "role": "user",
              "content": question
            }
          ]
        }),
        timeoutPromise
      ]) as ChatCompletion;
    } else if (inputType === 'image') {
      response = await Promise.race([
        openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant that provides step-by-step solutions to math and science questions. ${formatInstructions}`
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Solve the math or science problem in this image. Provide a step-by-step solution." },
                {
                  type: "image_url",
                  image_url: {
                    "url": `data:image/jpeg;base64,${imageBase64}`,
                    "detail": "low"
                  }
                }
              ]
            }
          ],
          max_tokens: 1000  // Increased to allow for more detailed responses
        }),
        timeoutPromise
      ]) as ChatCompletion;
    } else {
      return NextResponse.json({ error: 'Invalid input type' }, { status: 400 });
    }

    if (response.choices && response.choices.length > 0) {
      const message = response.choices[0].message as ChatCompletionMessage;
      if (message && message.content) {
        // Post-process the content to ensure proper formatting
        const formattedContent = postProcessContent(message.content);
        return NextResponse.json({ solution: formattedContent });
      }
    }
    
    throw new Error('Unexpected response format from OpenAI API');
  } catch (error) {
    console.error('Error in OpenAI API:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

function postProcessContent(content: string): string {
  // Ensure that math blocks are properly formatted
  let processed = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, p1) => {
    // Trim whitespace and ensure the equation is on its own line
    return `\n$$\n${p1.trim()}\n$$\n`;
  });

  // Ensure that steps are properly numbered and formatted
  processed = processed.replace(/^\d+\.\s/gm, (match) => `\n${match}`);

  return processed.trim();
}