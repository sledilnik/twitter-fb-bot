const getByHosAndByMunText = ({
  textArray,
  startIndex = 12,
  byHosRowLength = 4,
  byMunRowLength = 4,
  appenddixRow = [],
}) => {
  console.log("getByHosAndByMunText");
  const byHosByMun = textArray.slice(startIndex, textArray.length - 1);

  const HOSPITALS = "Stanje po bolnišnicah";
  const MUNICIPALITIES = "Po krajih";

  const byHosIndex = byHosByMun.findIndex((element) =>
    element.includes(HOSPITALS)
  );
  const byMunIndex = byHosByMun.findIndex((element) =>
    element.includes(MUNICIPALITIES)
  );

  const lastIndex = byHosByMun.length - 1;
  const diff = byMunIndex - byHosIndex;

  const _byHosRowLength = diff > byHosRowLength ? byHosRowLength : diff;
  const _byMunRowLength =
    lastIndex > byMunIndex + byMunRowLength ? byMunRowLength : lastIndex;

  console.log(`All rows: ${lastIndex + 1}`);
  console.log(`By HOS rows: ${byMunIndex}`);
  console.log(`By MUN rows: ${lastIndex + 1 - byMunIndex}`);
  console.log(`For byHos I will take ${_byHosRowLength} rows.`);
  console.log(`For byMub I will take ${_byMunRowLength} rows.`);

  const byHos = byHosByMun
    .slice(byHosIndex, _byHosRowLength)
    .concat(appenddixRow)
    .join("\n");
  const byMun = byHosByMun
    .slice(byMunIndex, byMunIndex + _byMunRowLength)
    .concat(appenddixRow)
    .join("\n");

  return { byHos, byMun };
};

const makeEpiThreadStatus = (epiText) => {
  const splittedText = epiText.split("\n");
  const emojis = splittedText.slice(-1);
  const lab = splittedText.slice(0, 5).concat(emojis).join("\n");
  const vacs = splittedText.slice(5, 8).concat(emojis).join("\n");
  const byAge = splittedText.slice(8, 9).concat(emojis).join("\n");
  const hos = splittedText.slice(9, 12).concat(emojis).join("\n");

  const { byHos, byMun } = getByHosAndByMunText({
    textArray: splittedText,
    appenddixRow: emojis,
    startIndex: 12,
    byHosRowLength: 4,
    byMunRowLength: 4,
  });

  return [lab, vacs, byAge, hos, byHos, byMun].map((item) => ({
    status: item,
  }));
};

module.exports = {
  EPI: makeEpiThreadStatus,
};
