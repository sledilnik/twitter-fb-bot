// tweet api allows only 4 media

exports.POST_SCREENS = {
  LAB: {
    screens: [
      "EmbedTestsToday",
      "EmbedTestsTodayHAT",
      "EmbedCasesAvg7Days",
      "EmbedCasesActive100k",
    ],
  },
  HOS: {
    screens: [
      "EmbedVaccinationSummary",
      "EmbedHospitalizedCurrent",
      "EmbedIcuCurrent",
      "EmbedDeceasedToDate",
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
