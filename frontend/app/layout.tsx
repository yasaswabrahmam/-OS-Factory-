import './globals.css';
import React from 'react';
import ToastContainer from '@/components/ToastContainer';
import CommandPalette from '@/components/CommandPalette';

export const metadata = {
  title: 'Factory OS — Decision Intelligence Platform',
  description: 'Enterprise Manufacturing Execution System & Industrial IoT Telemetry Analytics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070b14] text-slate-100 antialiased selection:bg-purple-500 selection:text-white">
        {children}
        <ToastContainer />
        <CommandPalette />
      </body>
    </html>
  );
}
