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
      ["Patients", "IcuPatients", "PatientsByHospital"],
      [
        "ALL",
        "DailyComparisonCasesConfirmed",
        "DailyComparisonCasesActive",
        "DailyComparisonPerformedPCR",
      ],
      ["DailyComparisonVaccinesUsed", "Regions100kVaccinated7DayAvg"],
      [
        "AgeGroupsTimelineNewCasesFourMonths",
        "AgeGroupsTimelineNewCasesRelativeFourMonths",
        "SchoolsActiveAbsolutePupilsFourMonths",
      ],
      [
        "Municipalities",
        "MapAbsolute1Day",
        "MapDistribution1Day",
        "MapWeeklyGrowthDay",
      ],
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
