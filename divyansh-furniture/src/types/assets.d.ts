/**
 * TypeScript 6 checks side-effect imports by default, and Next only declares
 * `*.module.css`. This covers the global stylesheet.
 */
declare module "*.css";
