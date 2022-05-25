//Меню

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

  return `<nav className="main-navigation">
  <a href="#all" className="main-navigation__item main-navigation__item--active">All movies</a>
  ${filterItemsTemplate}
</nav>`;
};

