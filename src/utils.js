import dayjs from 'dayjs';

const MAX_YEARS_GAP = 7;

const getDate = (someDate, format) => dayjs(someDate).format(format);

const getCorrectWord = (array, word) => array.length === 1 ? word : `${word}s`;

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getAnyRandomNumber = (min, max, afterPoint) => {
  const lower = Math.min(Math.abs(min), Math.abs(max));
  const upper = Math.max(Math.abs(min), Math.abs(max));
  const result = (Math.random() * (upper - lower) + lower).toFixed(afterPoint);
  return Number(result);
};

const getArrayRandomLength = (elements) => {
  const copyElements = elements.slice();
  copyElements.length = getRandomInteger(1, 5);
  return copyElements;
};

const generateDate = () => {
  const yearsGap = getRandomInteger(-MAX_YEARS_GAP, 0);

  return dayjs().add(yearsGap, 'year').toDate();
};

const getOneRandomArrayElem = (array) => array[getRandomInteger(0, array.length - 1)];

const generateBoolean = () => Boolean(getRandomInteger(0, 1));

const createIdGenerator = () => {
  let lastGeneratedId = 0;

  return function () {
    return ++lastGeneratedId;
  };
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const sortByDate = (filmA, filmB) => getDate(filmB.filmInfo.release.date, 'YYYY') - getDate(filmA.filmInfo.release.date, 'YYYY');

const sortByRating = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;


export {getDate, getCorrectWord, getRandomInteger, getAnyRandomNumber, getArrayRandomLength, generateDate, getOneRandomArrayElem, generateBoolean, createIdGenerator, updateItem, sortByDate, sortByRating};
