// app/layout.tsx
import React from 'react';
import './globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Home Page</title>
      </head>
      <body>
        <div className="container">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
