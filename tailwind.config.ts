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
            ...DEFAULT_THEME.COLORS,
            primary: '#756553',
            gold: {
               DEFAULT: '#b0997d',
               night: '#a7734b',
               white: '#faf2e6',
               light: '#fcfae0',
               dark: '#b0997d',
            },
            brown: '#a6542e',
            night: '#a7734b'
         },
         fontFamily: {
            app: 'var(--tf-poppins)',
         },
      }),
   },
   plugins: [
      plugin(microtailwind),
      plugin(microtailwindExperimental)
   ],
};
export default config;
