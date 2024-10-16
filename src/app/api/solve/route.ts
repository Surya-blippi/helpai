import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
You are a helpful assistant that provides step-by-step solutions to math and science questions. 
Always use proper LaTeX notation for mathematical expressions. For example:
- Use \sqrt{x} for square root of x
- Use \frac{a}{b} for fractions
- Use \cdot for multiplication
- Use \times for cross product
- Use ^ for exponents (e.g., x^2)
- Use \pi for pi
- Use \infty for infinity
- Use \sum_{i=1}^{n} for summation
- Use \int for integrals
- Use \lim_{x \to \infty} for limits

Enclose all mathematical expressions in $ signs for inline math, or $$ for display math.

Provide a clear, step-by-step solution with explanations for each step.
Always complete your explanations and never leave sentences unfinished.
`;

export async function POST(request: Request) {
  const body = await request.json();
  const { inputType, question, imageBase64 } = body;

  try {
    let response: OpenAI.Chat.Completions.ChatCompletion;

    if (inputType === 'text') {
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { "role": "system", "content": SYSTEM_PROMPT },
          { "role": "user", "content": question }
        ],
        max_tokens: 2000,
      });
    } else if (inputType === 'image') {
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { "role": "system", "content": SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Solve the math or science problem in this image. Provide a step-by-step solution using LaTeX notation for all mathematical expressions." },
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
        max_tokens: 2000,
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