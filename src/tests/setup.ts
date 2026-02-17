import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock fetch globally if needed
global.fetch = vi.fn()
