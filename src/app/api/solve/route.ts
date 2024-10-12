import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const runtime = 'edge';

export async function POST(request: Request) {
  console.log('API route called');

  try {
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body));

    const { inputType, question, imageBase64 } = body;

    let response;
    if (inputType === 'text') {
      console.log('Processing text input');
      response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            "role": "system",
            "content": [
              {
                "type": "text",
                "text": "You are a helpful assistant that provides detailed step-by-step solutions to math and science questions. Always provide complete answers."
              }
            ]
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": question
              }
            ]
          }
        ],
        max_tokens: 1000  // Increased token limit for text responses
      });
    } else if (inputType === 'image') {
      console.log('Processing image input');
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze the math or science problem in this image and provide a detailed, step-by-step solution. Ensure the answer is complete." },
              {
                type: "image_url",
                image_url: {
                  "url": `data:image/jpeg;base64,${imageBase64}`,
                  "detail": "high"  // Changed to high detail for better image analysis
                }
              }
            ]
          }
        ],
        max_tokens: 1000  // Increased token limit for image responses
      });
    } else {
      console.error('Invalid input type:', inputType);
      return NextResponse.json({ error: 'Invalid input type' }, { status: 400 });
    }

    console.log('OpenAI API response received');

    if (response && response.choices[0].message) {
      return NextResponse.json({ solution: response.choices[0].message.content });
    } else {
      console.error('No solution generated from OpenAI');
      throw new Error('No solution generated');
    }
  } catch (error) {
    console.error('Error in OpenAI API:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ error: 'An error occurred while generating the solution. Please try again.' }, { status: 500 });
  }
}