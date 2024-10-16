import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function handleApiError(error: unknown) {
  console.error('API Error:', error);
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inputType, question, imageBase64 } = body;

    let response: OpenAI.Chat.Completions.ChatCompletion;
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('OpenAI API request timed out')), 50000)
    );

    if (inputType === 'text') {
      response = await Promise.race([
        openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              "role": "system",
              "content": "You are a helpful assistant that provides step-by-step solutions to math and science questions."
            },
            {
              "role": "user",
              "content": question
            }
          ]
        }),
        timeoutPromise
      ]) as OpenAI.Chat.Completions.ChatCompletion;
    } else if (inputType === 'image') {
      response = await Promise.race([
        openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
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
          max_tokens: 500
        }),
        timeoutPromise
      ]) as OpenAI.Chat.Completions.ChatCompletion;
    } else {
      return NextResponse.json({ error: 'Invalid input type' }, { status: 400 });
    }

    if (response.choices && response.choices.length > 0 && response.choices[0].message) {
      return NextResponse.json({ solution: response.choices[0].message.content });
    } else {
      throw new Error('Unexpected response format from OpenAI API');
    }
  } catch (error) {
    return handleApiError(error);
  }
}