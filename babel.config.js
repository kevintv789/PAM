module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [
            ".ios.ts",
            ".android.ts",
            ".ts",
            ".ios.tsx",
            ".android.tsx",
            ".tsx",
            ".jsx",
            ".js",
            ".json",
          ],
          alias: {
            assets: "./src/assets",
            components: "./src/components",
            navigation: "./src/navigation",
            screens: "./src/screens",
            shared: "./src/shared",
            models: "./src/models",
            reducks: "./src/reducks",
          },
        },
      ],
    ],
  };
};
