var ADSKSpark = ADSKSpark || {};

(function () {
    var Client = ADSKSpark.Client;

    /**
     * A base class for paginated arrays of items.
     * @param {Object} data - JSON data.
     * @constructor
     */
    ADSKSpark.Paginated = function (data) {
        this.parse(data);
    };

    ADSKSpark.Paginated.prototype = Object.create(Array.prototype); // Almost-array
    ADSKSpark.Paginated.prototype.constructor = ADSKSpark.Paginated;

    /**
     * Return true if the previous link is valid.
     * @returns {boolean}
     */
    ADSKSpark.Paginated.prototype.hasPrev = function () {
        return this.data && !!this.data._link_prev;
    };

    /**
     * Get previous items.
     * Updates this object with the new items.
     * @returns {Promise} - A Promise that will resolve to an array of items.
     */
    ADSKSpark.Paginated.prototype.prev = function () {
        if (this.data) {
            var linkPrev = this.data._link_prev,
                that = this;

            if (linkPrev) {
                return Client.authorizedApiRequest(linkPrev)
                    .get()
                    .then(function (data) {
                        that.parse(data);
                        return that;
                    });
            }
        }
        return Promise.reject(new Error('no prev link'));
    };

    /**
     * Return true if the next link is valid.
     * @returns {boolean}
     */
    ADSKSpark.Paginated.prototype.hasNext = function () {
        return this.data && !!this.data._link_next;
    };

    /**
     * Get next items.
     * Updates this object with the new items.
     * @returns {Promise} - A Promise that will resolve to an array of items.
     */
    ADSKSpark.Paginated.prototype.next = function () {
        if (this.data) {
            var linkNext = this.data._link_next,
                that = this;

            if (linkNext) {
                return Client.authorizedApiRequest(linkNext)
                    .get()
                    .then(function (data) {
                        that.parse(data);
                        return that;
                    });
            }
        }
        return Promise.reject(new Error('no next link'));
    };

    ADSKSpark.Paginated.prototype.parse = function (data) {
        this.splice(0, this.length);
        this.data = data;
    };

})();
