import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

export async function middleware(req) {
    const token = req.cookies.get('accessJWT')?.value;
    const publicPaths = ['/login', '/sign-up'];
    
    // Si el usuario tiene un token y quiere entrar a un path publico
    if (token && publicPaths.includes(req.nextUrl.pathname)) {
        try {
            await jwtVerify(token, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));
            return NextResponse.redirect(new URL('/home', req.url));
        } catch (err) {
            console.log(err);
            return NextResponse.next();
        }
    }
    
    // Si el user no tiene un token y quiere entrar a un path publico
    if (publicPaths.includes(req.nextUrl.pathname)) {
        return NextResponse.next();
    }
    
    // Si el user no tiene un token y quiere entrar a un path protegido
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // Si el user tiene un token y quiere entrar a un path protegido
    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));
        return NextResponse.next();
    } catch (err) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

}

export const config = {
    matcher: '/((?!api|_next/static|favicon.ico).*)',
};