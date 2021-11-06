// tweet api allows only 4 media

exports.POST_SCREENS = {
  LAB: {
    screens: [
      "testsToday",
      "testsTodayHAT",
      "casesAvg7Days",
      "casesActive100k",
    ],
  },
  HOS: {
    screens: ["casesAvg7Days", "casesActive100k", "vaccinationSummary", "HOS"],
  },
};
