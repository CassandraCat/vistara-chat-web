module.exports = {
  stories: ["../src/**/*.stories.js"],
  core: {
    builder: "webpack5",
  },
  addons: [
    "@storybook/preset-create-react-app",
    "@storybook/addon-actions",
    "@storybook/addon-links",
  ],
};
