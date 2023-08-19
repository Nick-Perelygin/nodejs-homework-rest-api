const errorMessages = {
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Forbidden',
    403: 'Not found',
    404: 'Conflict'
}

const HttpError = (status, message = errorMessages[status]) => {
    const error = new Error(message);
    error.status = status;
    return error;
}

module.exports = HttpError;