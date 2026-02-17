import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error('Missing GOOGLE_AI_API_KEY environment variable')
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)

export async function generateSummary(text: string, type: 'article' | 'video' | 'website'): Promise<string> {
    try {
        if (!text || text.trim().length === 0) {
            return 'No summary available (empty content).'
        }
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        let prompt = `Summarize the following text concisely but comprehensively. Focus on the main ideas and key takeaways. Formatter your output as Markdown.`

        if (type === 'video') {
            prompt = `The following text includes the title, description, and transcript of a YouTube video. Provide a concise but comprehensive summary of the video's content, focusing on the key points and takeaways. Format your output as Markdown.`
        }

        const result = await model.generateContent([prompt, text])
        const response = await result.response
        return response.text()
    } catch (error) {
        console.error('Error generating summary:', error)
        return 'Summary unavailable.'
    }
}
