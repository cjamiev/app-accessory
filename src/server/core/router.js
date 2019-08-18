const resolvePostBody = async (request) => {
  const promise = new Promise((resolve, reject) => {
    const queryData = [];
    request.on('data', (data) => {
      queryData.push(data);
    });

    request.on('end', () => {
      resolve(JSON.parse(queryData.join().toString('utf8')));
    });
  });

  const result = await promise;

  return result;
};

const createNewPostRoute = (url, route) => {
  return async (req, res) => {
    if (req.url === url) {
      req.body = await resolvePostBody(req);
      route(req, res);
    }
  };
};

const createNewGetRoute = (url, route) => {
  return (req, res) => {
    if (req.url === url) {
      route(req, res);
    }
  };
};

const router = () => {
  const routesWithMethodGet = [];
  const routesWithMethodPost = [];
  const routes = {
    get(url, route) {
      routesWithMethodGet.push(createNewGetRoute(url, route));

      return this;
    },
    post(url, route) {
      routesWithMethodPost.push(createNewPostRoute(url, route));

      return this;
    },
    loadGetRoutes() {
      return routesWithMethodGet;
    },
    loadPostRoutes() {
      return routesWithMethodPost;
    }
  };

  return routes;
};

module.exports = { router };