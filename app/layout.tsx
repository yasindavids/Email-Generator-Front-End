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
          <header>
            <h1>Email Generator</h1>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
