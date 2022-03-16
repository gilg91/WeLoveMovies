const knex = require("../db/connection");

function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).del();
}

function read(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).first();
}

function update(updatedReview) {
  return knex("reviews")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*")
    .then(() => {
      return knex("critics")
        .select("preferred_name", "surname", "organization_name")
        .where({ critic_id: updatedReview.critic_id })
        .first();
    });
}

module.exports = {
  destroy,
  read,
  update,
};