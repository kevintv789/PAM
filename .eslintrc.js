module.exports = {
  root: true,
  extends: "@react-native-community",
  plugins: ["import"],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['components', './src/components'],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json', '.tsx', '.ts']
      }
    }
  }
};
