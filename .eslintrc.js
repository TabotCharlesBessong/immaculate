module.exports = {
  root: true,
  extends: [
    "expo",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier", // Make sure this is the last one
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks", "prettier"],
  parser: "@typescript-eslint/parser",
  rules: {
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off", // Not needed with new JSX transform
    "react/prop-types": "off", // We use TypeScript for prop types
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
