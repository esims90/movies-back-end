const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Validation middleware:
async function reviewIdExists(req, res, next) {
    const { reviewId } = req.params;
    const foundReview = await service.read(reviewId);
    if (foundReview) {
        res.locals.review = foundReview;
        return next();
    }
    next({ status: 404, message: `Review cannot be found.` });
}

//Route handlers:  
async function update(req, res) {
    const updatedReview = { ...res.locals.review, ...req.body.data };
    //Updates review
    await service.update(updatedReview);
    //Acquires data from review and critic tables
    const returnData = await service.getReviewWithCritic(
        res.locals.review.review_id
    );
    res.json({ data: returnData }); 
}
  
async function destroy(req, res) {
    const { review } = res.locals;
    await service.delete(review.review_id);
    res.sendStatus(204);
}
  
module.exports = {
    update: [
        asyncErrorBoundary(reviewIdExists),
        asyncErrorBoundary(update)
    ],
    delete: [
        asyncErrorBoundary(reviewIdExists), 
        asyncErrorBoundary(destroy)
    ],
};