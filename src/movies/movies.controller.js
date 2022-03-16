const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  return next({ status: 404, error: "Movie cannot be found." });
}

async function list(req, res) {
  if (req.query.is_showing) {
    res.json({ data: await service.isShowing() });
  }
  res.json({ data: await service.list() });
}

async function read(req, res) {
  const movie = res.locals.movie;
  res.json({ data: movie });
}

async function listTheaters(req, res) {
  const { movieId } = req.params;
  const result = await service.listTheaters(movieId);
  res.json({ data: result });
}

async function listReviews(req, res) {
  const { movieId } = req.params;
  const result = await service.listReviews(movieId);
  res.json({ data: result });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  listTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listTheaters),
  ],
  listReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listReviews),
  ],
};