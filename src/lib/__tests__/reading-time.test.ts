import { describe, it, expect } from 'vitest'
import { calculateReadingTime } from '../reading-time'

describe('calculateReadingTime', () => {
    it('calculates 1 minute for a small text', () => {
        const text = 'This is a test.'
        expect(calculateReadingTime(text)).toBe(1)
    })

    it('calculates correctly for roughly 200 words', () => {
        const text = 'word '.repeat(200)
        expect(calculateReadingTime(text)).toBe(1)
    })

    it('calculates 2 minutes for 201 words', () => {
        const text = 'word '.repeat(201)
        expect(calculateReadingTime(text)).toBe(2)
    })

    it('handles empty string', () => {
        expect(calculateReadingTime('')).toBe(0)
    })
})
