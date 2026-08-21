import badMark from "../assets/icons/result_bad.svg";
import goodMark from "../assets/icons/result_good.svg";
import holdMark from "../assets/icons/result_holdoff.svg";

// 게이지 위에 얹는 표정. 판정에 따라 갈린다.
const MARKS = {
  recommend: goodMark,
  hold: holdMark,
  avoid: badMark,
};

export const markOf = (type) => MARKS[type] ?? holdMark;
