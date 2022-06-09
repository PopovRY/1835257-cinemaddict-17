import UserProfileView from './view/user-profile-view.js';

import {generateFilm} from './mock/structures.js';
import {createFilter} from './filter.js';
import FilmsCountView from './view/films-count-view.js';

import MainNavigationItemView from './view/main-navigation-item-view.js';

import {render} from './framework/render.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';

export const FILM_CARD_COUNT = 5;
const FILM_COUNT = 20;

const films = Array.from({length: FILM_COUNT}, generateFilm);
const filter = createFilter(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('footer');

//Вставил профиль
render(new UserProfileView(), siteHeaderElement);

//Вставил меню
render(new MainNavigationItemView(filter), siteMainElement);

//Количество фильмов
render(new FilmsCountView(films.length), siteFooterElement);

/*
//Вставил карточки


const renderFilm = (filmsListElement, elements) => {
  const filmCardComponent = new FilmCardView(elements);
  const popupComponent = new FilmPopupView(elements, comments);

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

  render(filmCardComponent, filmsListElement);
};

const renderFilmList = (container, elements) => {
  const filmComponent = new FilmsSectionView();
  render(filmComponent, container);

  const filmListComponent = new FilmListView(elements);
  render(filmListComponent, filmComponent.element);
  const filmContainerComponent = new FilmsListContainer();
  render(filmContainerComponent, filmListComponent.element);

  for (let i = 0; i < Math.min(elements.length, FILM_CARD_COUNT); i++) {
    renderFilm(filmContainerComponent.element, elements[i]);
  }
  if (elements.length > FILM_CARD_COUNT) {
    let renderedFilmCount = FILM_CARD_COUNT;
    const showMoreButtonComponent = new ShowMoreButtonView();
    render(showMoreButtonComponent, filmListComponent.element);

    showMoreButtonComponent.setClickHandlerMoreBtn(() => {
      elements
        .slice(renderedFilmCount, renderedFilmCount + FILM_CARD_COUNT)
        .forEach((film) => renderFilm(filmContainerComponent.element, film));

      renderedFilmCount += FILM_CARD_COUNT;

      if (renderedFilmCount >= elements.length) {
        showMoreButtonComponent.element.remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }

  const filmsListExtraTopComponent = new FilmsListExtraView('Top rated');
  render(filmsListExtraTopComponent, filmComponent.element);
  const filmTopRateComponent = new FilmTopView();
  render(filmTopRateComponent, filmsListExtraTopComponent.element);

  const filmsListExtraCommentedComponent = new FilmsListExtraView('Most commented');
  render(filmsListExtraCommentedComponent, filmComponent.element);
  const filmMostCommentedComponent = new FilmTopView();
  render(filmMostCommentedComponent, filmsListExtraCommentedComponent.element);

  for (const film of films.slice(0, 2)) {
    renderFilm(filmTopRateComponent.element, film);
    renderFilm(filmMostCommentedComponent.element, film);
  }
};

renderFilmList(siteMainElement, films);

 */

const movieListPresenter = new MovieListPresenter(siteMainElement);
movieListPresenter.init(films);
