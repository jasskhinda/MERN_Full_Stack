import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;
      
      // Admin routes require admin role
      if (path.startsWith("/admin")) {
        return token?.role === "admin";
      }
      
      // Other protected routes just require authentication
      return !!token;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*", "/stock-predictor/:path*"],
};