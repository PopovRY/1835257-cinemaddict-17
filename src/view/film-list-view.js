import AbstractView from '../framework/view/abstract-view.js';

export const createFilmListTemplate = (films) => (
  `<section class="films-list">
      <h2 class="films-list__title ${films.length !== 0 && 'visually-hidden'}">${films.length !== 0 ? 'All movies. Upcoming' : '«There are no movies in our database»'}</h2>
  </section>`
);

export default class FilmListView extends AbstractView{
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template(){
    return createFilmListTemplate(this.#films);
  }
}
