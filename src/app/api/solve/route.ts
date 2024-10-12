import { NextResponse } from 'next/server';
import OpenAI from 'openai';

let openai: OpenAI;

try {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

export const runtime = 'edge'; // This enables the Edge runtime, which has a longer execution time limit

export async function POST(request: Request) {
  if (!openai) {
    return NextResponse.json({ error: 'OpenAI client is not initialized. Please check your API key.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { inputType, question, imageBase64 } = body;

    let response;
    if (inputType === 'text') {
      response = await openai.chat.completions.create({
        model: "gpt-4",  // Make sure this is the correct model name
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
      });
    } else if (inputType === 'image') {
      response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",  // Make sure this is the correct model name for image analysis
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
        max_tokens: 300,
      });
    }

    if (response && response.choices[0].message) {
      return NextResponse.json({ solution: response.choices[0].message.content });
    } else {
      throw new Error('No solution generated');
    }
  } catch (error) {
    console.error('Error in OpenAI API:', error);
    return NextResponse.json({ error: 'An error occurred while generating the solution. Please try again.' }, { status: 500 });
  }
}