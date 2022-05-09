const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieIdExists(req, res, next) {
    const { movieId } = req.params;
    const foundMovie = await service.read(movieId);
    if (foundMovie) {
        res.locals.movie = foundMovie;
        return next();
    }
    next({ status: 404, message: ` Movie cannot be found.` });
}

async function list(req, res) {
    if(req.query.is_showing){
        res.json({ data: await service.inTheatersNow() });
    }else{
        res.json({ data: await service.list() });
    }
}

async function read(req, res) {
    res.json({ data: res.locals.movie });
}

async function listTheatersForMovie(req, res) {
    const data = await service.listTheatersForMovie(res.locals.movie.movie_id);
    res.json({ data });
}


async function listReviewsForMovie(req, res) {
    const data = await service.listReviewsForMovie(res.locals.movie.movie_id);
    res.json({ data });
}

module.exports = {    
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieIdExists), read],
    listTheatersForMovie: [
        asyncErrorBoundary(movieIdExists), 
        asyncErrorBoundary(listTheatersForMovie)
    ],
    listReviewsForMovie: [
        asyncErrorBoundary(movieIdExists), 
        asyncErrorBoundary(listReviewsForMovie)
    ],
}; 