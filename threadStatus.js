const makeEpiThreadStatus = (epiText) => {
  const splittedText = epiText.split("\n");
  const emojis = splittedText.slice(-1);
  const lab = splittedText.slice(0, 5).concat(emojis).join("\n");
  const vacs = splittedText.slice(5, 8).concat(emojis).join("\n");
  const byAge = splittedText.slice(8, 9).concat(emojis).join("\n");
  const hos = splittedText.slice(9, 12).concat(emojis).join("\n");
  const byHosByMun = splittedText.slice(12, splittedText.length - 1);

  const HOSPITALS = "Stanje po bolnišnicah";
  const MUNICIPALITIES = "Po krajih";

  const byHosIndex = byHosByMun.findIndex((element) =>
    element.includes(HOSPITALS)
  );
  const byMunIndex = byHosByMun.findIndex((element) =>
    element.includes(MUNICIPALITIES)
  );

  const byHos = byHosByMun.slice(byHosIndex, 4).concat(emojis).join("\n");
  const byMun = byHosByMun
    .slice(byMunIndex, byMunIndex + 4)
    .concat(emojis)
    .join("\n");

  return [lab, vacs, byAge, hos, byHos, byMun].map((item) => ({
    status: item,
  }));
};

module.exports = {
  EPI: makeEpiThreadStatus,
};
