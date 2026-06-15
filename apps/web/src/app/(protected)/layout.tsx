import AppShell from "@/src/features/layout/AppShell";
import { AuthProvider } from "@/src/auth/AuthProvider";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AppShell>{children}</AppShell>
        </AuthProvider>
    );
}
