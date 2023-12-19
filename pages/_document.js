import { Html, Head, Main, NextScript } from "next/document";

/* represents a Next.js document with a basic HTML structure,
including metadata in the head section, main content in the body,
and necessary scripts for Next.js functionality */
export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
