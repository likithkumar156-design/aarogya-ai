import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';
 
export default createMiddleware(routing);
 
export const config = {
  matcher: ['/', '/(hi-IN|kn-IN|ta-IN|te-IN|mr-IN|en-IN)/:path*']
};
