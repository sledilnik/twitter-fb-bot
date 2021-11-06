const { CARD_SCREENS } = require("./screens");

exports.POST_SCREENS = {
  LAB: {
    screens: CARD_SCREENS.slice(0, 4),
  },
  HOS: {
    screens: CARD_SCREENS.slice(2, 6),
  },
};
