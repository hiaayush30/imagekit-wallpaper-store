import CredentialsProvider from "next-auth/providers/credentials";
import connectDb from "./db";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import User from "@/models/user.model";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email" },
                password: { label: "Password", type: "password", placeholder: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error('invalid credentials')
                }
                try {
                    await connectDb();
                    const user = await User.findOne({
                        email: credentials.email
                    })
                    if (!user) {
                        throw new Error('user not found')
                    }
                    const verifyPassword = await bcrypt.compare(credentials.password, user.password);
                    if (!verifyPassword) {
                        throw new Error('incorrect password');
                    }
                    return {
                        id: user._id as string,
                        email: user.email,
                        role: user.role
                    }
                } catch (error) {
                    console.error('Auth Error', error);
                    throw error;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 20 * 24 * 60 * 60 //30 days
    },
    callbacks: {
        async jwt({ token, user, profile }) {
            // The user object is only available when the user logs in. On subsequent requests, the token is used
            // we are setting what all things will be stored in the token
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = user.role;
            }
            else if (profile) {
                const foundUser = await User.findOne({
                    where: {
                        email: profile.email
                    }
                })
                if (foundUser) {
                    token.id = foundUser.id;
                    token.email = foundUser.email;
                    token.role = foundUser.role;
                }
            }
            return token
        },
        async session({ session, token }) { //extract whatever you need from the token
            session.user.id = token.id as string;
            session.user.role = token.role as string;
            session.user.email = token.email as string;
            return session
        }
    },
    pages: {
        signIn:'/login',
        error: '/login'
    },
    secret: process.env.NEXTAUTH_SECRET
}