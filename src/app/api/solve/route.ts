import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const body = await request.json();
  const { inputType, question, imageBase64 } = body;

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  const writeChunk = async (chunk: string) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
  };

  (async () => {
    try {
      let response: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;

      if (inputType === 'text') {
        response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              "role": "system",
              "content": "You are a helpful assistant that provides step-by-step solutions to math and science questions."
            },
            {
              "role": "user",
              "content": question
            }
          ],
          stream: true,
        });
      } else if (inputType === 'image') {
        response = await openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Solve the math or science problem in this image. Provide a step-by-step solution." },
                {
                  type: "image_url",
                  image_url: {
                    "url": `data:image/jpeg;base64,${imageBase64}`,
                    "detail": "high"
                  }
                }
              ]
            }
          ],
          max_tokens: 500,
          stream: true,
        });
      } else {
        throw new Error('Invalid input type');
      }

      for await (const part of response) {
        const chunk = part.choices[0]?.delta?.content || '';
        if (chunk) {
          await writeChunk(chunk);
        }
      }

      await writer.close();
    } catch (error) {
      console.error('API Error:', error);
      await writeChunk(`Error: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`);
      await writer.close();
    }
  })();

  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}