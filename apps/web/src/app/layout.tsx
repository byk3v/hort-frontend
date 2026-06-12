import type { Metadata } from 'next';
import { ConfigProvider } from 'antd';
import '../styles/globals.css';
import AppShell from "@/src/features/layout/AppShell";
import {AuthProvider} from "@/src/auth/AuthProvider";
export const metadata: Metadata = { title: 'HortApp', description: 'Panel Hort' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
        <body>
        <ConfigProvider>
            <AuthProvider>
                <AppShell>{children}</AppShell>
            </AuthProvider>
        </ConfigProvider>
        </body>
        </html>
    );
}