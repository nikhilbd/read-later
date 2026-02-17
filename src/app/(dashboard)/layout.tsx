import { Sidebar } from '@/components/sidebar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-white">
            <Sidebar className="hidden w-64 md:flex flex-shrink-0" />
            <div className="flex flex-1 flex-col overflow-hidden">
                {children}
            </div>
        </div>
    )
}
