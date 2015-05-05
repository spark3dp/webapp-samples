var ADSKSpark = ADSKSpark || {};

// A wrapper for XHR requests that returns a promise.
// Usage: ADSKSpark.Request('http://alpha.spark.autodesk.com/api/v1/printDB/printers').get([headers[, data]]).then(...);
// Based on https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise#Example_using_new_XMLHttpRequest()
/**
 * @param {String} url - The url for the request.
 * @param {String} [authorization] - If specified, the Authorization header will be set with this value by default.
 * @param {Object} [options] - May have the following options:
 *                              {
 *                                  notJsonResponse
 *                              }
 */
ADSKSpark.Request = function(url, authorization,options) {
    options = options || {};

    var makeRequest = function(method, headers, data) {
        headers = headers || {};

        var payload = '';

        if (data && method === 'GET') {
            var argcount = 0;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    if (argcount++) {
                        payload += '&';
                    }
                    payload += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
                }
            }
            url += '?' + payload;
            payload = '';
        } else {
            payload = data;
        }

        var promise = new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            // console.log(method + " -> " + url + " (" + payload + ")");
            xhr.open(method, url);

            // Set the headers
            for (var header in headers) {
                if (headers.hasOwnProperty(header)) {
                    xhr.setRequestHeader(header, headers[header]);
                }
            }

            if (authorization && !headers.hasOwnProperty('Authorization')) {
                xhr.setRequestHeader('Authorization', authorization);
            }

            xhr.onload = function() {
                if (xhr.status === 200 || xhr.status === 201 || xhr.status === 202 || xhr.status === 204) {

                    var response;

                    if (xhr.status != 204) {
                        if (!options.notJsonResponse) {
                            response = JSON.parse(xhr.responseText);
                        }else{
                            response = xhr.responseText;
                        }

                    }else{
                        //xhr.status 204 in the API means that the response is empty
                        response = true;
                    }

                    resolve(response);

                } else {
                    reject(new Error(xhr.status + ' ' + xhr.responseText));
                }
            };
            xhr.onerror = function(e) {
                // Why can we not get more info about what the error was?
                // See: https://xhr.spec.whatwg.org/#suggested-names-for-events-using-the-progressevent-interface
                // console.log('XHR error type: ' + e.type);

                // If the request failed, it's probably due to a 404.
                reject(new Error(404));
            };

            xhr.send(payload);
        });

        return promise;
    };

    return {
        'get': function(headers, data) {
            return makeRequest('GET', headers, data);
        },
        'post': function(headers, data) {
            return makeRequest('POST', headers, data);
        },
        'put': function(headers, data) {
            return makeRequest('PUT', headers, data);
        },
        'delete': function(headers, data) {
            return makeRequest('DELETE', headers, data);
        }
    };
};
