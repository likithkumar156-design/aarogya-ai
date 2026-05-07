import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  locales: ['hi-IN', 'kn-IN', 'ta-IN', 'te-IN', 'mr-IN', 'en-IN'],
  defaultLocale: 'en-IN',
  localePrefix: 'always'
});
