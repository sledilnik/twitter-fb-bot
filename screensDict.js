exports.CARD_SCREENS = [
  "testsToday",
  "testsTodayHAT",
  "hospitalizedCurrent",
  "icuCurrent",
  "deceasedToDate",
  "casesAvg7Days",
  "vaccinationSummary",
  "casesActive100k",
];

exports.MULTICARD_SCREENS = ["LAB", "HOS", "ALL"];

exports.CHART_SCREENS = [
  "MetricsComparison",
  "DailyComparison",
  "Tests",
  "Vaccination",
  "Regions100k",
  "Map",
  "Municipalities",
  "Sewage",
  "Schools",
  "SchoolStatus",
  "Patients",
  "IcuPatients",
  "CarePatients",
  "AgeGroupsTimeline",
  "WeeklyDemographics",
  "AgeGroups",
  "MetricsCorrelation",
  "Deceased",
  "ExcessDeaths",
  "Infections",
  "HcCases",
  "EuropeMap",
  "Sources",
  "Cases",
  "RegionMap",
  "Regions",
  "PhaseDiagram",
  "Spread",
  "WorldMap",
  "Ratios",
  "HCenters",
];

// see: https://github.com/jalezi/sledilnik-screenshots/blob/master/screenshots.js var CHART
exports.CUSTOM_CHART_SCREENS = {
  MapAbsolute1Day: { screen: "Map", custom: "absolute1Day" },
  MapDistribution1Day: { screen: "Map", custom: "distribution1Day" },
  MapWeeklyGrowthDay: { screen: "Map", custom: "weeklyGrowth" },
  DailyComparisonCasesConfirmed: {
    screen: "DailyComparison",
    custom: "casesConfirmed",
  },
  DailyComparisonCasesActive: {
    screen: "DailyComparison",
    custom: "casesActive",
  },
  DailyComparisonCasesSharePCR: {
    screen: "DailyComparison",
    custom: "casesSharePCR",
  },
  DailyComparisonPerformedPCR: {
    screen: "DailyComparison",
    custom: "performedPCR",
  },
  DailyComparisonTestsHAT: {
    screen: "DailyComparison",
    custom: "testsHAT",
  },
  DailyComparisonVaccinesUsed: {
    screen: "DailyComparison",
    custom: "vaccinesUsed",
  },
};
