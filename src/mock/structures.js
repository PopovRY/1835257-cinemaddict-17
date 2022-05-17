import dayjs from 'dayjs';

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

const DESCRIPTION = [
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

const COMMENTS_ARRAY = [

  {
    'id': '1',
    'author': 'Ilya O\'Reilly',
    'comment': 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
    'date': '2019-05-11T16:12:32.554Z',
    'emotion': 'smile'
  },
  {
    'id': '2',
    'author': 'Ilya O\'Reilly',
    'comment': 'Very very old. Meh',
    'date': '2019-05-11T16:12:32.554Z',
    'emotion': 'puke'
  },
  {
    'id': '3',
    'author': 'Ilya O\'Reilly',
    'comment': 'Almost two hours? Seriously?',
    'date': '2019-05-11T16:12:32.554Z',
    'emotion': 'angry'
  },
  {
    'id': '4',
    'author': 'Ilya O\'Reilly',
    'comment': 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
    'date': '2019-05-11T16:12:32.554Z',
    'emotion': 'smile'
  },
  {
    'id': '42',
    'author': 'Ilya O\'Reilly',
    'comment': 'Booooooooooring',
    'date': '2019-05-11T16:12:32.554Z',
    'emotion': 'sleeping'
  },
];

const GENRES = ['Action','Comedy','Drama','Fantasy','Horror'];

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

const getArrayRandomLength = (arr) => {
  const copyArray = arr.slice();
  copyArray.length = getRandomInteger(1, 5);
  return copyArray;
};

const createIdGenerator = () => {
  let lastGeneratedId = 0;

  return function () {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};

const generateFilmId = createIdGenerator();

const getCommentId = () => {
  const copyArray = COMMENTS_ARRAY.slice();
  copyArray.length = getRandomInteger(0, 5);

  return copyArray.map(({id}) => id);
};

const generateBoolean = () => Boolean(getRandomInteger(0, 1));

const generateDate = () => {
  const maxYearsGap = 7;
  const yearsGap = getRandomInteger(-maxYearsGap, 0);

  return dayjs().add(yearsGap, 'year').toDate();
};

const getTitle = (titles) => titles[getRandomInteger(0, titles.length - 1)];
const getFilmPoster = (posters) => posters[getRandomInteger(0, posters.length - 1)];


export const generateFilm = () => (
  {
    'id': generateFilmId().toString(),
    'comments': getCommentId(),
    'filmInfo': {
      'title': getTitle(FILM_TITLES),
      'alternativeTitle': getTitle(FILM_TITLES),
      'totalRating': getAnyRandomNumber(0,10,1),
      'poster': getFilmPoster(FILM_POSTERS),
      'ageRating': 18,
      'director': 'Tom Ford',
      'writers': [
        'Takeshi Kitano'
      ],
      'actors': [
        'Morgan Freeman'
      ],
      'release': {
        'date': generateDate(),
        'releaseCountry': 'Finland'
      },
      'runtime': getRandomInteger(0, 200),
      'genres': getArrayRandomLength(GENRES),
      'description': getArrayRandomLength(DESCRIPTION).join(''),
    },
    'userDetails': {
      'watchlist': generateBoolean(),
      'alreadyWatched': generateBoolean(),
      'watchingDate': dayjs().toDate(),
      'favorite': generateBoolean(),
    }
  }
);

export {COMMENTS_ARRAY};
