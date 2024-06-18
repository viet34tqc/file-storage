import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])
export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})
export const config = {
  // Middleware will run on this kind of routes, except for assets folder
  matcher: ['/((?!.+.[w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
