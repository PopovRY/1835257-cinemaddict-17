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

const siteBodyElement = document.querySelector('body');

export default class MovieListPresenter {
  #container = null;

  #sortComponent = new SortView();
  #filmComponent = new FilmsSectionView();
  #filmListComponent = new FilmListView();
  #filmContainerComponent = new FilmsListContainer();


  #films = [];

  constructor(container) {
    this.#container = container;
  }

  init = (films) => {
    this.#films = [...films];

    render(this.#sortComponent, this.#container);
    render(this.#filmComponent, this.#container);
    render(this.#filmListComponent, this.#filmComponent);
    render(this.#filmContainerComponent, this.#filmListComponent,);
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

  #renderFilmList = (container, films) => {
    const filmComponent = new FilmsSectionView();
    render(filmComponent, container);

    const filmListComponent = new FilmListView(films);
    render(filmListComponent, this.#filmComponent);
    render(this.#filmContainerComponent, filmListComponent);

    for (let i = 0; i < Math.min(films.length, FILM_CARD_COUNT); i++) {
      this.#renderFilm(this.#filmContainerComponent, films[i]);
    }
  };

  #renderLoadMoreButton = () => {
    if (this.#films.length > FILM_CARD_COUNT) {
      let renderedFilmCount = FILM_CARD_COUNT;
      const showMoreButtonComponent = new ShowMoreButtonView();
      render(showMoreButtonComponent, this.#filmListComponent);

      showMoreButtonComponent.setClickHandlerMoreBtn(() => {
        this.#films
          .slice(renderedFilmCount, renderedFilmCount + FILM_CARD_COUNT)
          .forEach((film) => this.#renderFilm(film));

        renderedFilmCount += FILM_CARD_COUNT;

        if (renderedFilmCount >= this.#films.length) {
          showMoreButtonComponent.remove();
          showMoreButtonComponent.removeElement();
        }
      });
    }
  };

  #renderExtra = () => {
    const filmsListExtraTopComponent = new FilmsListExtraView('Top rated');
    render(filmsListExtraTopComponent, this.#filmComponent);
    const filmTopRateComponent = new FilmTopView();
    render(filmTopRateComponent, filmsListExtraTopComponent);

    const filmsListExtraCommentedComponent = new FilmsListExtraView('Most commented');
    render(filmsListExtraCommentedComponent, this.#filmComponent);
    const filmMostCommentedComponent = new FilmTopView();
    render(filmMostCommentedComponent, filmsListExtraCommentedComponent);

    for (const film of this.#films.slice(0, 2)) {
      this.#renderFilm(filmTopRateComponent, film);
      this.#renderFilm(filmMostCommentedComponent, film);
    }
  };
}

