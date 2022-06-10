import UserProfileView from './view/user-profile-view.js';
import {createFilter} from './filter.js';
import FilmsCountView from './view/films-count-view.js';
import MainNavigationItemView from './view/main-navigation-item-view.js';
import {render} from './framework/render.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import FilmsModel from './model/model.js';

export const FILM_CARD_COUNT = 5;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('footer');

const filmsModel = new FilmsModel();
const filter = createFilter(filmsModel.films);

//Вставил профиль
render(new UserProfileView(), siteHeaderElement);

//Вставил меню
render(new MainNavigationItemView(filter), siteMainElement);

//Количество фильмов
render(new FilmsCountView(filmsModel.films.length), siteFooterElement);

const movieListPresenter = new MovieListPresenter(siteMainElement, filmsModel);
movieListPresenter.init();
