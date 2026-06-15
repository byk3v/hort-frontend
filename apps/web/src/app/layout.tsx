import type { Metadata } from 'next';
import { ConfigProvider } from 'antd';
import '../styles/globals.css';
export const metadata: Metadata = { title: 'HortApp', description: 'Panel Hort' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
        <body>
        <ConfigProvider>
            {children}
        </ConfigProvider>
        </body>
        </html>
    );
}
