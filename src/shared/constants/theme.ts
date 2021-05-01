const colors = {
  accent: "#3D405B",
  primary: "#DC7356",
  secondary: "#81B29A",
  tertiary: "#EEBC6D",
  offWhite: "#F4F1DE",
  red: "#D85531",
  black: "#323643",
  white: "#FFFFFF",
  gray: "#9DA3B4",
  gray2: "#C5CCD6",
};

const fontSizes = {
  // global font size
  small: 12,
  regular: 14,
  medium: 16,
  big: 18,
};

const sizes = {
  // global sizes
  base: 16,
  radius: 6,
  padding: 25,
  icon: 27,

  // font sizes
  h1: 26,
  h2: 20,
  h3: 18,
  title: 18,
  header: 16,
  body: 14,
  caption: 12,
};

const fonts = {
  h1: {
    fontSize: sizes.h1,
  },
  h2: {
    fontSize: sizes.h2,
  },
  h3: {
    fontSize: sizes.h3,
  },
  header: {
    fontSize: sizes.header,
  },
  title: {
    fontSize: sizes.title,
  },
  body: {
    fontSize: sizes.body,
  },
  caption: {
    fontSize: sizes.caption,
  },
};

const sharedStyles = {
  shadowEffect: {
    // The following was created through ethercreative's shadow generator
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 5,
  },
};

export { colors, sizes, fonts, fontSizes, sharedStyles };
