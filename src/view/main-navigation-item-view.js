import {createElement} from '../render.js';

export const createMenuItemTemplate = (filter) => {
  const {name, count} = filter;

  return (
    `<a href="#${name}" class="main-navigation__item">${name.charAt(0).toUpperCase() + name.slice(1)} <span class="main-navigation__item-count">${count}</span></a>`
  );
};
export const createMenuTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createMenuItemTemplate(filter, index === 0))
    .join('');

  return `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${filterItemsTemplate}
    </nav>`;
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
