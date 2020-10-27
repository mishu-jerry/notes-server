
module.exports = function(err, req, res, next) {
    // TODO: log the exception
    
    // 500: Internal Server Error
    res.status(500).send('Error processing the request.');
}