export function calculateReadingTime(text: string): number {
    const trimmed = text.trim()
    if (!trimmed) return 0
    const wordsPerMinute = 200
    const words = trimmed.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return minutes
}
