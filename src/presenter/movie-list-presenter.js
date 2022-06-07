import SortView from '../view/sort-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmsListContainer from '../view/films-list-container.js';
import {remove, render} from '../framework/render.js';
import {comments} from '../mock/structures.js';
import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import {FILM_CARD_COUNT} from '../main.js';
import ShowMoreButtonView from '../view/more-button-view.js';
import FilmsListExtraView from '../view/films-list-extra-view.js';
import FilmTopView from '../view/film-top-view.js';
import HeadingFilmList from '../view/heading-film-list-view';

const siteBodyElement = document.querySelector('body');

export default class MovieListPresenter {
  #container = null;

  #sortComponent = new SortView();
  #filmComponent = new FilmsSectionView();
  #filmListComponent = new FilmListView();
  #filmContainerComponent = new FilmsListContainer();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filmsListExtraTopComponent = new FilmsListExtraView('Top rated');
  #filmsListExtraCommentedComponent = new FilmsListExtraView('Most commented');
  #filmTopRateComponent = new FilmTopView();
  #filmMostCommentedComponent = new FilmTopView();


  #films = [];
  #renderedFilmCount = FILM_CARD_COUNT;

  constructor(container) {
    this.#container = container;
  }

  init = (films) => {
    this.#films = [...films];

    render(this.#sortComponent, this.#container);
    render(this.#filmComponent, this.#container);
    render(this.#filmListComponent, this.#filmComponent);
    render(this.#filmContainerComponent, this.#filmListComponent,);
    this.#renderFilmList(this.#films);
    this.#renderShowMoreButton();
    this.#renderHeadingFilmList();
    this.#renderExtra();
  };

  #renderFilm = (films) => {
    const filmCardComponent = new FilmCardView(films);
    const popupComponent = new FilmPopupView(films, comments);

    const openPopup = () => {
      render(popupComponent, siteBodyElement);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        remove(popupComponent);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    filmCardComponent.setFilmCardClickHandler(() => {
      openPopup();
      siteBodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', onEscKeyDown);
    });

    popupComponent.setPopupClickHandler(() => {
      remove(popupComponent);
      siteBodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(filmCardComponent, this.#filmContainerComponent);
  };

  #renderHeadingFilmList= () => {
    const headingFilmListComponent = new HeadingFilmList(this.#films);
    render(headingFilmListComponent, this.#filmListComponent);
  };

  #renderFilmList = (films) => {

    for (let i = 0; i < Math.min(films.length, this.#renderedFilmCount); i++) {
      this.#renderFilm(films[i]);
    }
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmListComponent);

    this.#showMoreButtonComponent.setClickHandlerMoreBtn(this.#handleShowMoreButtonClick);
  };

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_CARD_COUNT);
    this.#renderedFilmCount += FILM_CARD_COUNT;

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#showMoreButtonComponent.removeElement();
    }

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

  #renderExtra = () => {
    render(this.#filmsListExtraTopComponent, this.#filmComponent,);
    render(this.#filmTopRateComponent, this.#filmsListExtraTopComponent);

    render(this.#filmsListExtraCommentedComponent, this.#filmComponent);
    render(this.#filmMostCommentedComponent, this.#filmsListExtraCommentedComponent);

    for (const film of this.#films.slice(0, 2)) {
      this.#renderFilm(this.#filmTopRateComponent, film);
      this.#renderFilm(this.#filmMostCommentedComponent, film);
    }
  };
}

