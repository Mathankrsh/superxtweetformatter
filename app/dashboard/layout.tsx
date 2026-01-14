import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tweet Improver AI - Dashboard",
    description: "Transform messy text into perfectly formatted viral tweets",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
