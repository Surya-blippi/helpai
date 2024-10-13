import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inputType, question, imageBase64 } = body;

    let response;
    if (inputType === 'text') {
      response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides step-by-step solutions to math and science questions."
          },
          {
            role: "user",
            content: question
          }
        ]
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
                  "url": `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      });
    } else {
      return NextResponse.json({ error: 'Invalid input type' }, { status: 400 });
    }

    if (response.choices && response.choices[0].message) {
      return NextResponse.json({ solution: response.choices[0].message.content });
    } else {
      throw new Error('No solution generated');
    }
  } catch (error) {
    console.error('Error in OpenAI API:', error);
    return NextResponse.json({ error: 'An error occurred while generating the solution' }, { status: 500 });
  }
}