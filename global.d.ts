// Type declarations for static asset imports used in Next.js + TypeScript
// This file tells TypeScript what to do when you import stylesheets or images
// as side-effect imports (e.g. `import './globals.css'`) or as modules.

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css';
declare module '*.scss';

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';

declare module '*.module.sass';

declare module '*.module.less';

// Allow importing JSON files without explicit types
declare module '*.json' {
  const value: any;
  export default value;
}

// If you're using next/image static imports, you can add more specific types here later.
