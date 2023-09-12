class FetchResponseError extends Error{
    /**
     * @param {Number}status
     * @param {String}location
     * @param {String}message
     * @param {Response}response
     */
    constructor(status, location, message, response) {
        super(message);
        this.location = location
        this.status = status;
        this.response = response;
    }
}

/**
 *
 */
class FetchError extends Error{
    /**
     * @param {String}message
     * @param {String}location
     * @param {Error}err
     */
    constructor(message, location, err) {
        super(message);
        this.location = location
        this.error = err;
    }
}

/**
 *
 * @param {String}uri
 * @param {Object}option
 * @return {Promise<Response>}
 * @throws {FetchResponseError}
 * @throws {FetchError}
 */
const fetch2 = (uri, option)=>{
    return fetch(uri, option)
                .then(r=>{
                    if(!r.ok){
                        throw new FetchResponseError(r.status, uri, "Bad response", r)
                    }
                    return r
                })
                .catch(e=>{
                    if(e instanceof FetchResponseError) throw e
                    throw new FetchError("Fetch API error", uri, e)
                })
}

exports.fetch2 = fetch2;
exports.FetchResponseError = FetchResponseError;
exports.FetchError = FetchError;