"use client";

import { DemoModeProvider } from "../components/DemoModeContext";
import { CompanyProfileProvider } from "../components/CompanyProfileContext";
import Sidebar from "../components/Sidebar";
import styles from "./layout.module.css";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DemoModeProvider>
            <CompanyProfileProvider>
                <div className={styles.layout}>
                    <Sidebar />
                    <main className={styles.main}>
                        <div className={styles.content}>
                            {children}
                        </div>
                    </main>
                </div>
            </CompanyProfileProvider>
        </DemoModeProvider>
    );
}
