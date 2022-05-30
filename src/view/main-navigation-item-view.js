import {createElement} from '../render.js';

export const createMenuItemTemplate = (filter) => {
  const {name, count} = filter;

  return (
    `<a href="#${name.toLowerCase()}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`
  );
};
export const createMenuTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createMenuItemTemplate(filter, index === 0))
    .join('');

  return `<a href="#all" className="main-navigation__item main-navigation__item--active">All movies</a>
  ${filterItemsTemplate}`;
};
export default class MainNavigationItemView {
  #element = null;
  #filters = null;

  constructor(filters) {
    this.#filters = filters;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMenuTemplate(this.#filters);
  }

  removeElement() {
    this.#element = null;
  }
}
