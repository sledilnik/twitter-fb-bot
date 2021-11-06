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
    screens: [
      "vaccinationSummary",
      "hospitalizedCurrent",
      "icuCurrent",
      "deceasedToDate",
    ],
  },
  EPI: {
    screens: [
      ["DailyComparison"],
      ["Tests", "Vaccination"],
      ["AgeGroups"],
      ["Patients"],
      ["IcuPatients"],
      ["Regions"],
    ],
  },
};
