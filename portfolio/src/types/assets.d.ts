/**
 * Next handles plain stylesheet imports itself and ships no type declaration
 * for them, which TypeScript 6 rejects by default now that it checks
 * side-effect imports. This states what `import "./globals.css"` means: a
 * build-time instruction with no value attached.
 */
declare module "*.css";
