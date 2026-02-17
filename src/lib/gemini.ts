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

        let prompt = `Summarize the following text in 3 concise sentences. Focus on the main takeaways.`

        if (type === 'video') {
            prompt = `The following text is improved metadata and description from a video page. Summarize what this video is likely about in 3 concise sentences.`
        }

        const result = await model.generateContent([prompt, text])
        const response = await result.response
        return response.text()
    } catch (error) {
        console.error('Error generating summary:', error)
        return 'Summary unavailable.'
    }
}
