import SortView from '../view/sort-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmsListContainer from '../view/films-list-container.js';
import {remove, render} from '../framework/render.js';
import {FILM_CARD_COUNT} from '../main.js';
import FilmsListExtraView from '../view/films-list-extra-view.js';
import FilmTopView from '../view/film-top-view.js';
import HeadingFilmList from '../view/heading-film-list-view.js';
import MoviePresenter from './movie-presenter.js';
import {sortDate, sortRating} from '../utils/utils.js';
import {SortType, UpdateType, UserAction} from '../const.js';


export default class MovieListPresenter {
  #container = null;
  #filmsModel = null;
  #sortComponent = null;
  #showMoreButtonComponent = null;

  #filmComponent = new FilmsSectionView();
  #filmListComponent = new FilmListView();
  #filmContainerComponent = new FilmsListContainer();
  #filmsListExtraTopComponent = new FilmsListExtraView('Top rated');
  #filmsListExtraCommentedComponent = new FilmsListExtraView('Most commented');
  #filmTopRateComponent = new FilmTopView();
  #filmMostCommentedComponent = new FilmTopView();
  #moviePresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  #renderedFilmCount = FILM_CARD_COUNT;

  constructor(container, filmsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#filmsModel.films].sort(sortDate);
      case SortType.RATING:
        return [...this.#filmsModel.films].sort(sortRating);
    }
    return this.#filmsModel.films;
  }

  init = () => {

    this.#renderFilmList();

    //this.#renderExtra();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#container);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderFilm = (film) => {
    const moviePresenter = new MoviePresenter(this.#filmContainerComponent.element, this.#handleViewAction);
    moviePresenter.init(film);
    this.#moviePresenter.set(film.id, moviePresenter);

  };

  #renderHeadingFilmList= () => {
    const headingFilmListComponent = new HeadingFilmList();
    render(headingFilmListComponent, document.querySelector('.films-list'));
  };

  #renderFilmList = () => {
    const films = this.films;
    const filmCount = films.length;


    this.#renderSort();
    render(this.#filmComponent, this.#container);
    render(this.#filmListComponent, document.querySelector('.films'));
    render(this.#filmContainerComponent, document.querySelector('.films-list'));


    this.#renderHeadingFilmList();

    this.#renderFilms(films.slice(0, this.#renderedFilmCount));

    if (filmCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmListComponent.element);
    this.#showMoreButtonComponent.setClickHandlerMoreBtn(this.#handleShowMoreButtonClick);
  };

  #handleShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_CARD_COUNT);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }

  };

  #clearFilmList = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();
    remove(this.#sortComponent);
    remove(this.#showMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_CARD_COUNT;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film, this.#filmContainerComponent));
  };


  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#filmsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.deleteComment(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.COMMENT:
        this.#moviePresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearFilmList();
        this.#renderFilmList();

        break;
      case UpdateType.MAJOR:
        this.#clearFilmList({resetRenderedTaskCount: true, resetSortType: true});
        this.#renderFilmList();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    this.#clearFilmList({resetRenderedFilmCount: true});
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

