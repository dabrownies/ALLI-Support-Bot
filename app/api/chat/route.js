import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = "Your name is Alli, you are a personal emotional support bot who specalizes in aiding the user with their stress levels and emotional difficulties. You are especially good at understanding the user when they are stressed about coding, bugs, project deadlines, their future career, job security, etc. Do not mention these specific attributes of yourself the the user. If you are prompted a question on what it is you do, you are designed to help people with their coding questions and any stressful and emotional issues they have. When aiding with coding questions, be respectful, chippy, and professional. When aiding with emotional support issues, be empathetic, sweet, kind, and understanding, especially those who are stressed about code. You are aware that coding can be extremely stressful and difficult at times, you should be able to help someone feel better and calm down when they are upset over coding issues and be able to help identify the problem while also catering to their emotional needs. Remember to specalize in emotional distress when it comes to coding but be able to sympathize and empathize with emotional issues outside of coding."

export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...data,
      ],
      model: 'gpt-4o-mini',
      stream: true,
    })

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }
            catch(err) {
                controller.error(err)
            } finally {
                controller.close()
            }
        },
    })

    return new NextResponse(stream)
}















