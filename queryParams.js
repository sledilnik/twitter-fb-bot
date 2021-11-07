const {
  CARD_SCREENS,
  MULTICARD_SCREENS,
  CHART_SCREENS,
  CUSTOM_CHART_SCREENS,
} = require("./screensDict");

const defaultQueryParams = {
  type: "",
  screen: "",
  immediateDownload: false,
};

exports.CARDS_QUERY_PARAMS = CARD_SCREENS.reduce((acc, screen) => {
  const cardDefault = { ...defaultQueryParams, type: "card" };
  acc[screen] = { ...cardDefault, screen };
  return acc;
}, {});

exports.MULTICARDS_QUERY_PARAMS = MULTICARD_SCREENS.reduce((acc, screen) => {
  const cardDefault = { ...defaultQueryParams, type: "multicard" };
  acc[screen] = { ...cardDefault, screen };
  return acc;
}, {});

exports.CHARTS_QUERY_PARAMS = CHART_SCREENS.reduce((acc, screen) => {
  const cardDefault = { ...defaultQueryParams, type: "chart" };
  acc[screen] = { ...cardDefault, screen };
  return acc;
}, {});

exports.CUSTOM_CHARTS_QUERY_PARAMS = Object.entries(
  CUSTOM_CHART_SCREENS
).reduce((acc, [key, { screen, custom }]) => {
  const cardDefault = { ...defaultQueryParams, type: "chart" };
  acc[key] = { ...cardDefault, screen, custom };
  return acc;
}, {});
