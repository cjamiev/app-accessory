const getRoute = {
  table: routeTable,
  modal: routeModal,
  accordion: routeAccordion,
  alert: routeAlert,
  form: routeForm,
  home: routeHome
};

const resetRouter = () => {
  const body = document.body;
  const router = document.getElementById('router');
  body.removeChild(router);

  const changedRouter = document.createElement('div');
  changedRouter.id = 'router';
  changedRouter.className = 'container';
  body.appendChild(changedRouter);
};

const changePage = page => {
  resetRouter();
  getRoute[page]();

  sessionStorage.setItem('page', page);
};

const init = () => {
  const page = sessionStorage.getItem('page');
  if (page) {
    getRoute[page]();
  }
};

init();
