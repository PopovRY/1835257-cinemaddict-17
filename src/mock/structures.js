import dayjs from 'dayjs';
import {
  createIdGenerator,
  generateBoolean,
  generateDate,
  getAnyRandomNumber,
  getArrayRandomLength,
  getOneRandomArrayElem,
  getRandomInteger
} from '../utils.js';
import {nanoid} from 'nanoid';
import {EMOJIS} from '../const.js';

const FILM_TITLES = [
  'Made for each other',
  'Popeye meets sinbad',
  'Sagebrush trail',
  'Santa claus conquers the martians',
  'The dance of life',
  'The great flamarion',
  'The man with the golden arm'
];

const FILM_POSTERS = ['images/posters/made-for-each-other.png',
  'images/posters/popeye-meets-sinbad.png',
  'images/posters/sagebrush-trail.jpg',
  'images/posters/santa-claus-conquers-the-martians.jpg',
  'images/posters/the-dance-of-life.jpg',
  'images/posters/the-great-flamarion.jpg',
  'images/posters/the-man-with-the-golden-arm.jpg',];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];


const COMMENT_AUTHORS = [
  'Leonardo',
  'Raphael',
  'Donatello',
  'Michelangelo',
];

const COMMENTS = [
  'A film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'A true masterpiece.',
  'Post-credit scene was just amazing omg.',
  'A true masterpiece, post-credit scene was just amazing omg.',
];

const GENRES = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror'];

const AGE_RATINGS = ['6+', '12+', '14+', '16+', '18+'];

const COUNTRIES = [
  'Finland',
  'USA',
  'Canada',
  'French',
  'Germany',
  'Australia',
];

const DIRECTORS = [
  'John Cromwell',
  'Otto Preminger',
  'Max Fleischer',
  'Armand Schaefer',
  'Anthony Mann',
];
const WRITERS = [
  'Joe Swerling',
  'Adolph Zukor',
  'Lindsley Parsons',
  'Anne Wiston',
  'Benjamin Glazer',
];
const ACTORS = [
  'James Stewart',
  'Carole Lombard',
  'Charles Coburn',
  'Frank Sinatra',
  'Eleanor Parker',
  'Kim Novak',
  'Erich Von Stroheim',
  'Mary Beth Hughes',
  'Hal Skelly',
  'Nancy Carroll',
];

const MIN_TIME = 0;
const MAX_TIME = 200;

const MIN_RATING = 0;
const MAX_RATING = 10;
const NUMB_AFT_POINT = 1;

const MIN_COMMENTS = 1;
const MAX_COMMENTS = 5;

const getFilmRating = () => getAnyRandomNumber(MIN_RATING, MAX_RATING, NUMB_AFT_POINT);

//const generateFilmId = createIdGenerator();
const generateCommentId = createIdGenerator();

export const generateComment = () => ({
  id: generateCommentId(),
  author: getOneRandomArrayElem(COMMENT_AUTHORS),
  comment: getOneRandomArrayElem(COMMENTS),
  date: generateDate(),
  emotion: getOneRandomArrayElem(EMOJIS),
});

const comments = Array.from({length: getAnyRandomNumber(MIN_COMMENTS, MAX_COMMENTS)}, generateComment);

const getCommentsId = () => {
  const copyComments = comments.slice();
  copyComments.length = getRandomInteger(MIN_COMMENTS, MAX_COMMENTS);

  return copyComments.map(({id}) => id);
};

export const generateFilm = () => (
  {
    'id': nanoid(),
    'comments': getCommentsId(),
    'filmInfo': {
      'title': getOneRandomArrayElem(FILM_TITLES),
      'alternativeTitle': getOneRandomArrayElem(FILM_TITLES),
      'totalRating': getFilmRating(),
      'poster': getOneRandomArrayElem(FILM_POSTERS),
      'ageRating': getOneRandomArrayElem(AGE_RATINGS),
      'director': getOneRandomArrayElem(DIRECTORS),
      'writers': getArrayRandomLength(WRITERS),
      'actors': getArrayRandomLength(ACTORS),
      'release': {
        'date': generateDate(),
        'releaseCountry': getOneRandomArrayElem(COUNTRIES)
      },
      'runtime': getRandomInteger(MIN_TIME, MAX_TIME),
      'genres': getArrayRandomLength(GENRES),
      'description': getOneRandomArrayElem(DESCRIPTIONS),
    },
    'userDetails': {
      'watchlist': generateBoolean(),
      'alreadyWatched': generateBoolean(),
      'watchingDate': dayjs().toDate(),
      'favorite': generateBoolean(),
    }
  }
);

export {comments};
