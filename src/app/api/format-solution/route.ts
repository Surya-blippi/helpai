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
    const { solution } = await request.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          "role": "system",
          "content": "You are an assistant that formats mathematical solutions for easy readability. Use markdown and LaTeX syntax to structure the solution clearly. Separate steps, highlight key points, and ensure equations are properly formatted."
        },
        {
          "role": "user",
          "content": `Please format the following solution for better readability:\n\n${solution}`
        }
      ],
      max_tokens: 1000
    });

    if (response.choices && response.choices.length > 0 && response.choices[0].message) {
      const formattedSolution = response.choices[0].message.content;
      return NextResponse.json({ formattedSolution });
    } else {
      throw new Error('Unexpected response format from OpenAI API');
    }
  } catch (error) {
    return handleApiError(error);
  }
}