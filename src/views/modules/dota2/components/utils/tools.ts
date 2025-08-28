import { SolarDay, LunarHour } from "tyme4ts"; // https://github.com/6tail/tyme4ts

/**
 * 类型合并，将key一样的对象、放到同一个数组。
 * @param arr [array] 数组
 * @param str [string] key值
 * @return Array<array> 二维数组
 *
 * 例如：
 *  [{type:1},{type:1},{type:2}] ===> [[{type:1},{type:1}], [{type:2}]]
 * */
type ArrayItem = Record<string, any>;

export function regroupArr(arr: Array<ArrayItem>, str: string): Array<ArrayItem[]> {
  const obj: Record<string, ArrayItem[]> = {};

  arr.forEach(item => {
    const key = item[str];
    obj[key] = obj[key] || [];
    obj[key].push(item);
  });

  return Object.keys(obj).map(k => obj[k]);
}

export function dateFormat(d, format = "YYYY-MM-DD") {
  const date = new Date(d * 1000);
  const weekDays = ["星期日", "星期一", "星期一", "星期三", "星期四", "星期五", "星期六"];

  const config = {
    YYYY: date.getFullYear(),
    MM: (date.getMonth() + 1).toString().padStart(2, "0"),
    DD: date.getDate().toString().padStart(2, "0"),
    HH: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds(),
    dddd: weekDays[date.getDay()]
  };

  for (const key in config) {
    format = format.replace(key, config[key]);
  }

  return format;
}

export function compareDates(a, b) {
  const datePartsA = a.dateMount.split("-");
  const datePartsB = b.dateMount.split("-");

  const monthA = parseInt(datePartsA[0]);
  const dayA = parseInt(datePartsA[1]);

  const monthB = parseInt(datePartsB[0]);
  const dayB = parseInt(datePartsB[1]);

  if (monthA === monthB) {
    return dayA - dayB;
  } else {
    return monthA - monthB;
  }
}

// 返回【天干/地支】字段
export function addSixtyWord(year, month, day) {
  const solarDay = SolarDay.fromYmd(+year, +month, +day);
  const lunarDay = solarDay.getLunarDay(); // 转为农历 (不包含时辰)

  // console.log("%c [ lunarDay ] >>>", "color:#2656c9", lunarDay.toString());

  const yearTianGan = lunarDay.getYearSixtyCycle(); // 年——天干地支
  const monthTianGan = lunarDay.getMonthSixtyCycle(); // 月——天干地支
  const dayTianGan = lunarDay.getSixtyCycle(); // 日——天干地支

  return `${yearTianGan.toString()} ${monthTianGan.toString()} ${dayTianGan.toString()}`;
}

// 返回【天干/地支】数组
export function addSixtyWordArray(date) {
  const solarDay = SolarDay.fromYmd(+date.split("-")[0], +date.split("-")[1], +date.split("-")[2]);
  const lunarDay = solarDay.getLunarDay(); // 转为农历 (不包含时辰)

  const yearTianGan = lunarDay.getYearSixtyCycle(); // 年——天干地支
  const monthTianGan = lunarDay.getMonthSixtyCycle(); // 月——天干地支
  const dayTianGan = lunarDay.getSixtyCycle(); // 日——天干地支

  // console.log("%c [ lunarDay ] >>>", "color:#2656c9", lunarDay.toString());
  // return `${yearTianGan.toString()} ${monthTianGan.toString()} ${dayTianGan.toString()}`;
  return {
    year: {
      天干: yearTianGan.toString()[0],
      地支: yearTianGan.toString()[1]
    },
    month: {
      天干: monthTianGan.toString()[0],
      地支: monthTianGan.toString()[1]
    },
    day: {
      天干: dayTianGan.toString()[0],
      地支: dayTianGan.toString()[1]
    }
  };
}
