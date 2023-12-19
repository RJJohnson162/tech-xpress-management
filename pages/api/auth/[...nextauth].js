import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";

// Define admin emails
const adminEmails = ["richardnyamwamu@gmail.com"];

// Define authentication options
export const authOptions = {
    secret: process.env.SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        session: async ({ session, user }) => {
            // Check if the user is an admin
            const isAdmin = adminEmails.includes(user.email);

            // Update the session with the admin flag
            session.isAdmin = isAdmin;

            // Return the updated session
            return session;
        },
    },
};

// Initialize NextAuth with the provided options
export default NextAuth(authOptions);

// Middleware function to check if a request is from an admin
export async function isAdminRequest(req, res) {
    try {
        // Retrieve the user session
        const session = await getServerSession(req, res, authOptions);

        // Check if the user is an admin
        if (!session.isAdmin) {
            res.status(401).end();
            throw new Error("Not an admin");
        }
    } catch (error) {
        console.error("Admin request error:", error.message);
        res.status(401).end(); // You may want to customize the response based on your requirements
    }
}
