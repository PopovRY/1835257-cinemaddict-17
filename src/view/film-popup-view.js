//Подробная информация о фильме (попап)

import {getDate, getCorrectWord} from '../utils/utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {EMOJIS} from '../const.js';

const addCheckedProperty = (isChecked) => isChecked ? 'checked' : '';

const renderFilmDetails = (name, value) => (
  `<tr class="film-details__row">
  <td class="film-details__term">${name}</td>
  <td class="film-details__cell">${value}</td>
</tr>`
);

const renderGenreItem = (elements) => {
  if (elements.length > 0) {
    return elements.map((item) => `<span class="film-details__genre">${item}</span>`).join(', ');
  }
};


const createCommentTemplate = (commentId, comments) => comments.filter((element) => commentId.includes(element.id)).map((element) =>

  `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${element.emotion}.png" width="55" height="55" alt="emoji-${element.emotion}">
        </span>
          <div>
            <p class="film-details__comment-text">${element.comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${element.author}</span>
              <span class="film-details__comment-day">${getDate(element.date, 'YYYY/MM/DD HH:mm')}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
      </li>`).join(' ');


const createNewCommentTemplate = (emojiIcon, checkedEmojiItem, comment) => (
  `
      <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">${emojiIcon !== '' ? `<img src="/images/emoji/${emojiIcon}.png" width="55" height="55" alt="emoji-smile">` : ''}</div>
        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
        </label>
        <div class="film-details__emoji-list">
        ${EMOJIS.map((emoji) => `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${addCheckedProperty(`emoji-${emoji}` === checkedEmojiItem)}>
        <label class="film-details__emoji-label" for="emoji-${emoji}">
          <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
        </label>`).join(' ')}
        </div>
      </div>
    `
);

export const createPopupTemplate = (data, comments) => {
  const {title, runtime, genres, description, poster, director, writers, actors} = data['filmInfo'];
  const rating = data['filmInfo']['totalRating'];
  const date = data['filmInfo']['release']['date'];
  const {watchlist} = data['userDetails'];
  const watchFilm = data['userDetails']['alreadyWatched'];
  const favorite = data['userDetails']['favorite'];
  const ageRating = data['filmInfo']['ageRating'];
  const alternativeTitle = data['filmInfo']['alternativeTitle'];
  const country = data['filmInfo']['release']['releaseCountry'];
  const {emojiIcon, checkedEmojiItem, isDisabled, comment} = data;

  const dateFormat = getDate(date, 'D MMMM YYYY');

  const getTime = () => {
    const hours = Math.trunc(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}м`;
  };

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">
          <p class="film-details__age">${ageRating}</p>
        </div>
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${alternativeTitle}</p>
            </div>
            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>
          <table class="film-details__table">
            ${renderFilmDetails('Director', director)}
            ${renderFilmDetails('Writers', writers.join(', '))}
            ${renderFilmDetails('Actors', actors.join(', '))}
            ${renderFilmDetails('Release Date', dateFormat)}
            ${renderFilmDetails('Runtime', getTime())}
            ${renderFilmDetails('Country', country)}
            ${renderFilmDetails(getCorrectWord(genres, 'Genre'), renderGenreItem(genres))}
          </table>
          <p class="film-details__film-description">
             ${description}
          </p>
        </div>
      </div>
      <section class="film-details__controls">
        <button type="button" class="film-details__control-button ${watchlist ? 'film-details__control-button--active' : ''} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${watchFilm ? 'film-details__control-button--active' : ''} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button ${favorite ? 'film-details__control-button--active' : ''} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${data.comments.length}</span></h3>
        <ul class="film-details__comments-list">
          ${createCommentTemplate(data.comments, comments)}
        </ul>
        ${createNewCommentTemplate(emojiIcon, checkedEmojiItem, comment, isDisabled)}</div>
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmPopupView extends AbstractStatefulView {
  #comments = null;

  constructor(film, comments) {
    super();
    this._state = FilmPopupView.parseFilmToState(film);
    this.#comments = comments;
    this.#setInnerHandlers();
  }

  get template(){
    return createPopupTemplate(this._state, this.#comments);
  }

  get scrollOffset() { return this.element.scrollTop; }
  set scrollOffset(value) { this.element.scrollTop = value; }

  reset = (film) => {
    this.updateElement(
      FilmPopupView.parseFilmToState(film),
    );
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#emojiItemsClickHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#descriptionInputHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setPopupClickHandler(this._callback.popupClick);
    this.setPopupWatchlistClickHandler(this._callback.popupWatchlistClick);
    this.setPopupHistoryClickHandler(this._callback.popupHistoryClick);
    this.setPopupFavoriteClickHandler( this._callback.popupFavoriteClick);
  };

  setPopupClickHandler = (callback) => {
    this._callback.popupClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#popupClickHandler);
  };

  #getElementUpdated = (update) => {
    const scrollOffset = this.scrollOffset;
    this.updateElement(update);
    this.scrollOffset = scrollOffset;
  };

  #emojiItemsClickHandler = (evt) => {
    evt.preventDefault();
    this.#getElementUpdated({
      emojiIcon: evt.target.value,
      checkedEmojiItem: evt.target.id,
    });
  };

  #descriptionInputHandler = (evt) => {
    evt.preventDefault();
    this.element.querySelector('.film-details__comment-input').textContent = evt.target.value;
    this._setState({
      comment: evt.target.value,
    });
  };

  setPopupWatchlistClickHandler = (callback) => {
    this._callback.popupWatchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#popupWatchlistClickHandler);
  };

  setPopupHistoryClickHandler = (callback) => {
    this._callback.popupHistoryClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#popupHistoryClickHandler);
  };

  setPopupFavoriteClickHandler = (callback) => {
    this._callback.popupFavoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#popupFavoriteClickHandler);
  };

  #popupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.popupClick(FilmPopupView.parseStateToFilm(this._state));
  };

  #popupWatchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.popupWatchlistClick();
  };

  #popupHistoryClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.popupHistoryClick();
  };

  #popupFavoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.popupFavoriteClick();
  };

  static parseFilmToState = (film) => ({...film,
    emojiIcon: '',
    checkedEmojiItem: '',
    comment: '',
    isDisabled: false,
  });

  static parseStateToFilm = (state) => {
    const film = {...state};
    delete film.emojiIcon;
    delete film.checkedEmojiItem;
    delete film.comment;
    delete film.isDisabled;

    return film;
  };
}
