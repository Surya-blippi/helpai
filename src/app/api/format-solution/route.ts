import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    const formattedSolution = response.choices[0].message.content;

    return NextResponse.json({ formattedSolution });
  } catch (error) {
    console.error('Error in format-solution API:', error);
    return NextResponse.json({ error: 'An error occurred while formatting the solution' }, { status: 500 });
  }
}