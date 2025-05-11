import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    function middleware(req) {
        console.log(req.nextauth.token)
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl

                //allow webhook
                if (pathname.startsWith("/api/webhook")) {
                    return true;
                }

                //allow auth related routes
                if (
                    pathname.startsWith("/api/auth") ||
                    pathname.startsWith("/login") ||
                    pathname.startsWith("/register")
                ) {
                    return true;
                }

                //public routes
                if (
                    pathname === "/" ||
                    pathname.startsWith("/api/products") ||
                    pathname.startsWith("/products")
                ) {
                    return true
                }

                //admin routes require admin role
                if (
                    pathname.startsWith("/admin")
                ) {
                    return token?.role === "admin"
                }

                //all other routes require authentication
                return token ? true : false
            },
        },
    },
)

export const config = {
    matcher: [
        // match all routed paths except static files,image optimization files/favicon files and public folder
        "/((?!_next/static|_next/image|favicon.ico|public/).*)"
    ]
}

//or

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// export { default } from 'next-auth/middleware';

// export async function middleware(request: NextRequest) {
//     const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
//     const url = request.nextUrl; //url that user is requesting for

//     // console.log("Token:", token);

//     if (token) {
//         if(token?.role !== "admin"){
//             if(
//                 url.pathname.startsWith("/admin") ||
//                 url.pathname.startsWith("/api/admin")
//             ){
//                 return NextResponse.redirect(new URL("/dashboard",request.nextUrl))
//             }
//         }
//         if (
//             url.pathname.startsWith('/login') ||
//             url.pathname.startsWith('/signup')
//         ) {
//             return NextResponse.redirect(new URL('/dashboard', request.url));
//         }
//     } else if (!token) {
//         if (url.pathname.startsWith('/dashboard')) {
//             return NextResponse.redirect(new URL('/', request.url));
//         }
//     }

//     return NextResponse.next(); // Continue as normal
// }

// // Apply middleware only to these routes
// export const config = {
//     matcher: ['/dashboard/:path*', '/login', '/signup','/dashboard'],
// };