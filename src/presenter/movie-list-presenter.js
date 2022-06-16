import SortView from '../view/sort-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmsListContainer from '../view/films-list-container.js';
import {remove, render} from '../framework/render.js';
import {FILM_CARD_COUNT} from '../main.js';
import ShowMoreButtonView from '../view/more-button-view.js';
import FilmsListExtraView from '../view/films-list-extra-view.js';
import FilmTopView from '../view/film-top-view.js';
import HeadingFilmList from '../view/heading-film-list-view.js';
import MoviePresenter from './movie-presenter.js';
import {sortDate, sortRating, updateItem} from '../utils/utils.js';
import {SortType} from '../const.js';


export default class MovieListPresenter {
  #container = null;
  #filmsModel = null;
  #sortComponent = null;

  #filmComponent = new FilmsSectionView();
  #filmListComponent = new FilmListView();
  #filmContainerComponent = new FilmsListContainer();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filmsListExtraTopComponent = new FilmsListExtraView('Top rated');
  #filmsListExtraCommentedComponent = new FilmsListExtraView('Most commented');
  #filmTopRateComponent = new FilmTopView();
  #filmMostCommentedComponent = new FilmTopView();
  #moviePresenter = new Map();
  #currentSortType = SortType.DEFAULT;


  #films = [];
  #sourcedFilms = [];
  #renderedFilmCount = FILM_CARD_COUNT;

  constructor(container, filmsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.films];
    this.#sourcedFilms = [...this.#filmsModel.films];

    this.#renderSort();
    render(this.#filmComponent, this.#container);
    render(this.#filmListComponent, document.querySelector('.films'));
    render(this.#filmContainerComponent, document.querySelector('.films-list'));
    this.#renderFilmList(this.#films);
    this.#renderShowMoreButton();
    this.#renderHeadingFilmList();

    //this.#renderExtra();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#container);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderFilm = (film) => {
    const moviePresenter = new MoviePresenter(this.#filmContainerComponent.element, this.#handleFilmChange);
    moviePresenter.init(film);
    this.#moviePresenter.set(film.id, moviePresenter);

  };

  #renderHeadingFilmList= () => {
    const headingFilmListComponent = new HeadingFilmList(this.#films);
    render(headingFilmListComponent, document.querySelector('.films-list'));
  };

  #renderFilmList = () => {
    this.#renderHeadingFilmList();
    this.#renderFilmsLogic();
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmListComponent.element);
    this.#showMoreButtonComponent.setClickHandlerMoreBtn(this.#handleShowMoreButtonClick);
  };

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_CARD_COUNT);
    this.#renderedFilmCount += FILM_CARD_COUNT;

    if (this.#renderedFilmCount >= this.#films.length) {
      remove(this.#showMoreButtonComponent);
    }

  };

  #clearFilmList = () => {
    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();
    this.#renderedFilmCount = FILM_CARD_COUNT;
    remove(this.#showMoreButtonComponent);
  };

  #renderFilms = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film, this.#filmContainerComponent));
  };

  #renderFilmsLogic = () => {
    this.#renderFilms(0, Math.min(this.#films.length, FILM_CARD_COUNT));
    if (this.#films.length > FILM_CARD_COUNT) {
      this.#renderShowMoreButton();
    }
  };

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
    this.#moviePresenter.get(updatedFilm.id).init(updatedFilm);
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#films.sort(sortDate);
        break;
      case SortType.RATING:
        this.#films.sort(sortRating);
        break;
      default:
        this.#films = [...this.#sourcedFilms];
    }
    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    this.#sortFilms(sortType);
    this.#clearFilmList();
    this.#renderFilmList();
  };
/*
  #renderExtra = () => {
    render(this.#filmsListExtraTopComponent, document.querySelector('.films'));
    render(this.#filmTopRateComponent, this.#filmsListExtraTopComponent);

    render(this.#filmsListExtraCommentedComponent, document.querySelector('.films'));
    render(this.#filmMostCommentedComponent, this.#filmsListExtraCommentedComponent);

    for (const film of this.#films.slice(0, 2)) {
      this.#renderFilm(this.#filmTopRateComponent, film);
      this.#renderFilm(this.#filmMostCommentedComponent, film);
    }
  };

 */
}

