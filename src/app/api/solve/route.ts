import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inputType, question, imageBase64 } = body;

    let response: OpenAI.Chat.Completions.ChatCompletion;

    if (inputType === 'text') {
      response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            "role": "system",
            "content": "You are a helpful assistant that provides step-by-step solutions to math and science questions. Use LaTeX for equations."
          },
          {
            "role": "user",
            "content": question
          }
        ],
        max_tokens: 1000,
      });
    } else if (inputType === 'image') {
      response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Solve the math or science problem in this image. Provide a step-by-step solution. Use LaTeX for equations." },
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
        max_tokens: 1000,
      });
    } else {
      return NextResponse.json({ error: 'Invalid input type' }, { status: 400 });
    }

    if (response.choices && response.choices.length > 0 && response.choices[0].message) {
      return NextResponse.json({ solution: response.choices[0].message.content });
    } else {
      throw new Error('Unexpected response format from OpenAI API');
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' }, { status: 500 });
  }
}