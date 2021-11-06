const {
  CARDS_QUERY_PARAMS,
  MULTICARDS_QUERY_PARAMS,
  CHARTS_QUERY_PARAMS,
} = require("./queryParams");

function getScrenshotParams(params) {
  return {
    FunctionName: "sledilnikScreenshot",
    InvocationType: "RequestResponse",
    LogType: "Tail",
    Payload: JSON.stringify({ queryStringParameters: params }),
  };
}

const CARDS = Object.entries(CARDS_QUERY_PARAMS).reduce(
  (acc, [screen, params]) => {
    acc[screen] = getScrenshotParams(params);
    return acc;
  },
  {}
);

const MULTICARDS = Object.entries(MULTICARDS_QUERY_PARAMS).reduce(
  (acc, [screen, params]) => {
    acc[screen] = getScrenshotParams(params);
    return acc;
  },
  {}
);

const CHARTS = Object.entries(CHARTS_QUERY_PARAMS).reduce(
  (acc, [screen, params]) => {
    acc[screen] = getScrenshotParams(params);
    return acc;
  },
  {}
);

const DEFAULT = MULTICARDS.ALL;

module.exports = { CARDS, MULTICARDS, CHARTS, DEFAULT };
