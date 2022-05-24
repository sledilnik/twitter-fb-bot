const twitter = require("twitter-text");

const getRangeCheckedThread = (thread) =>
  thread.map((text, index) => {
    const { validRangeEnd, displayRangeEnd } = twitter.parseTweet(text);
    const isOk = validRangeEnd === displayRangeEnd;
    if (isOk) {
      console.log({ index, validRangeEnd, displayRangeEnd, isOk });
      console.log(text);
      console.log();
      return text;
    }

    const removeLastLine = (currentText) => {
      console.log("Removing last line from thread with index: ", index);
      const splittedText = currentText.split("\n");
      const newText = splittedText.slice(0, -1).join("\n");
      const { validRangeEnd, displayRangeEnd } = twitter.parseTweet(newText);
      const isOk = validRangeEnd === displayRangeEnd;
      if (isOk) {
        console.log({ validRangeEnd, displayRangeEnd, isOk });
        console.log(text);
        console.log();
        return newText;
      }
      return removeLastLine(newText);
    };

    console.log({ index, validRangeEnd, displayRangeEnd, isOk });
    return removeLastLine(text);
  });

const getByHosAndByMunText = ({
  textArray,
  startIndex = 14,
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
  const header = splittedText.slice(0, 1);
  const lab = splittedText.slice(1, 5);
  const vacs = splittedText.slice(5, 7);
  const totalCases = splittedText.slice(7, 8);
  const byAge = splittedText.slice(8, 9);
  const hos = splittedText.slice(9, 14);

  const { byMun } = getByHosAndByMunText({
    textArray: splittedText,
    appenddixRow: [],
    startIndex: 14,
    byHosRowLength: 3,
    byMunRowLength: 11,
  });

  const tOne = header.concat(lab).concat(totalCases).join("\n");
  const tTwo = vacs.join("\n");
  const tThree = byAge.join("\n");
  const tFour = hos
    .concat(["Več: https://covid-19.sledilnik.org/sl/stats#patients-chart"])
    .join("\n")
    .replace("Hospitalizirani", "🏥🛌");
  const tFive = byMun;

  const thread = [tOne, tTwo, tThree, tFour, tFive];
  const rangeCheckedThread = getRangeCheckedThread(thread);

  return rangeCheckedThread.map((item) => ({
    status: item,
  }));
};

const makeEpiWThreadStatus = (epiText) => {
  const splittedText = epiText.split("\n");
  const header = splittedText.slice(0, 1);
  const lab = splittedText.slice(1, 5);
  const vacs = splittedText.slice(5, 7);
  const totalCases = splittedText.slice(7, 8);
  const byAge = splittedText.slice(8, 9);

  const { byMun } = getByHosAndByMunText({
    textArray: splittedText,
    appenddixRow: [],
    startIndex: 9,
    byHosRowLength: 0,
    byMunRowLength: 11,
  });

  const tOne = header.concat(lab).concat(totalCases).join("\n");
  const tTwo = vacs.join("\n");
  const tThree = byAge.join("\n");
  const tFour = byMun;

  const thread = [tOne, tTwo, tThree, tFour];
  const rangeCheckedThread = getRangeCheckedThread(thread);

  return rangeCheckedThread.map((item) => ({
    status: item,
  }));
};

const makeEpiHosThreadStatus = (epiText) => {
  const splittedText = epiText.split("\n");
  const emojis = splittedText.slice(-1);
  const hos = splittedText.slice(9, 12).concat(emojis).join("\n");

  const { byHos } = getByHosAndByMunText({
    textArray: splittedText,
    appenddixRow: emojis,
    startIndex: 12,
    byHosRowLength: 4,
    byMunRowLength: 4,
  });

  return [hos, byHos].map((item) => ({
    status: item,
  }));
};

const makeEpiMunThreadStatus = (epiText) => {
  const splittedText = epiText.split("\n");
  const emojis = splittedText.slice(-1);
  const lab = splittedText.slice(0, 5).concat(emojis).join("\n");

  const { byMun } = getByHosAndByMunText({
    textArray: splittedText,
    appenddixRow: emojis,
    startIndex: 12,
    byHosRowLength: 4,
    byMunRowLength: 4,
  });

  return [lab, byMun].map((item) => ({
    status: item,
  }));
};

module.exports = {
  EPI: makeEpiThreadStatus,
  EPI_W: makeEpiWThreadStatus,
  EPI_HOS: makeEpiHosThreadStatus,
  EPI_MUN: makeEpiMunThreadStatus,
};
