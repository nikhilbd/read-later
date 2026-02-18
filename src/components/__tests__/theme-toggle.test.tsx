import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '../theme-toggle'
import { vi, describe, it, expect } from 'vitest'
import { useTheme } from 'next-themes'

// Mock next-themes
vi.mock('next-themes', () => ({
    useTheme: vi.fn(),
}))

describe('ThemeToggle', () => {
    it('renders all theme options', () => {
        vi.mocked(useTheme).mockReturnValue({
            theme: 'light',
            setTheme: vi.fn(),
            resolvedTheme: 'light',
            themes: ['light', 'dark', 'system'],
            forcedTheme: undefined,
            systemTheme: 'light',
        })

        render(<ThemeToggle />)

        expect(screen.getByTitle(/set theme to light/i)).toBeInTheDocument()
        expect(screen.getByTitle(/set theme to dark/i)).toBeInTheDocument()
        expect(screen.getByTitle(/set theme to system/i)).toBeInTheDocument()
    })

    it('calls setTheme when a theme button is clicked', () => {
        const setThemeMock = vi.fn()
        vi.mocked(useTheme).mockReturnValue({
            theme: 'light',
            setTheme: setThemeMock,
            resolvedTheme: 'light',
            themes: ['light', 'dark', 'system'],
            forcedTheme: undefined,
            systemTheme: 'light',
        })

        render(<ThemeToggle />)

        const darkButton = screen.getByTitle(/set theme to dark/i)
        fireEvent.click(darkButton)

        expect(setThemeMock).toHaveBeenCalledWith('dark')
    })
})
