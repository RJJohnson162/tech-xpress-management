import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

//This function sets up the app google Authentication privileges
export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
}
