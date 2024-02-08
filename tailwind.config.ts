import type { Config } from "tailwindcss";
import { microtailwind, microtailwindExperimental, withMicrotailwindExtensions } from "microtailwind";
import plugin from "tailwindcss/plugin";

const config: Config = {
   content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
   ],
   theme: {
      extend: withMicrotailwindExtensions({
         colors: {
            primary: {
               DEFAULT: '#22d099',
               pastel: '#2b7874'
            },

            font: {
               DEFAULT: '#2d2d2d',
               grey: '#958c81',
               invalid: '#e44b68',
            },
         },
         fontFamily: {
            app: 'var(--tf-app)',
         },
      }),
   },
   plugins: [
      plugin(microtailwind),
      plugin(microtailwindExperimental)
   ],
};
export default config;
