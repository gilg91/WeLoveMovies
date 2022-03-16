const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name"
});

function isShowing() {
  return knex("movies_theaters as mt")
    .select("*")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .where({ "mt.is_showing": true })
    .groupBy("m.movie_id");
}

function list() {
  return knex("movies")
    .select("*")
}

function read(movieId) {
  return knex("movies")
    .select("*")
    .where({ movie_id: movieId })
    .groupBy("movies.movie_id")
    .first();
}

function listTheaters(movieId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select("t.*", "mt.*")
    .where({ "mt.movie_id": movieId, "mt.is_showing": true });
}

function listReviews(movieId) {
  return knex("movies as m")
    .join("reviews as r", "r.movie_id", "m.movie_id")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*")
    .where({ "r.movie_id": movieId })
    .then((result) => {
      const criticArr = [];
      result.forEach((item) => {
        const addedCritic = addCritic(item);
        criticArr.push(addedCritic);
      });

      return criticArr;
    });
}


module.exports = {
  isShowing,
  list,
  read,
  listTheaters,
  listReviews,
};