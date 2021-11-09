// tweet api allows only 4 media

exports.POST_SCREENS = {
  LAB: {
    screens: ["LAB"],
  },
  HOS: {
    screens: ["HOS"],
  },
  EPI: {
    screens: [
      ["EmbedIcuCurrent"],
      ["EmbedDeceasedToDate", "MapWeeklyGrowthDay"],
      ["DailyComparisonCasesActive", "icuCurrent", "Map"],
      [],
      [],
      [],
    ],
  },
  EPI_HOS: {
    screens: [["Patients", "IcuPatients"], ["HOS"]],
  },
  EPI_MUN: {
    screens: [
      [
        "Municipalities",
        "MapAbsolute1Day",
        "MapDistribution1Day",
        "MapWeeklyGrowthDay",
      ],
      ["LAB"],
    ],
  },
};
