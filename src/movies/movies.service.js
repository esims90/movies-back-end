const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

//Nested critics object for data object in listReviewsForMovie
const addCriticDetails = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname:"critic.surname",
    organization_name: "critic.organization_name",
});
  

function list() {
    return knex("movies").select("*");
}

function inTheatersNow(){
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .select("m.*")
        .where({"mt.is_showing": true})        
        .groupBy("m.movie_id");

}

function read(movieId) {
    return knex("movies as m")
        .select("*")
        .where({ "m.movie_id": movieId})
        .first();
}

function listTheatersForMovie(movieId) {
    return knex("movies_theaters as mt")
        .join("theaters as t", "mt.theater_id", "t.theater_id")
        .select("*")
        .where({ movie_id: movieId})
}

function listReviewsForMovie(movieId) {
    return knex("movies as m")
        .join("reviews as r", "r.movie_id", "m.movie_id")
        .join("critics as c", "c.critic_id", "r.critic_id")
        .select("*")
        .where({ "r.movie_id": movieId })
        .then((reviews) => {
            const reviewsWithCriticDetails = [];
            reviews.forEach((review) => {
                const addedCritic = addCriticDetails(review);
                reviewsWithCriticDetails.push(addedCritic)
            });
            return reviewsWithCriticDetails;
        });
}



module.exports = {
    list,
    inTheatersNow,
    read,
    listTheatersForMovie,
    listReviewsForMovie,
}; 