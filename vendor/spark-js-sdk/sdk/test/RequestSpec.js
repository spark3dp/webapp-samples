describe('Request', function() {
    'use strict';

    var ASR, xhr, requests;
    var testURL;

    /*
     * Tests that the promise is resolved for a given response code.
     */
    var testResponseCode = function(method, responseCode) {
        var request = ASR(testURL);
        var promise = request[method.toLowerCase()]();

        promise.should.be.instanceOf(Promise);

        // Check that a request was sent properly
        requests.length.should.equal(1);
        var fakeXhr = requests[0];
        fakeXhr.url.should.equal(testURL);
        fakeXhr.method.should.equal(method);
        Should(fakeXhr.requestBody).not.be.ok; // body should be null or ''

        // Fake a successful response
        var response = responseCode == 204 ? 'Success!' : JSON.stringify('Success!');
        fakeXhr.respond(responseCode, {'Content-Type': 'application/json'}, response);

        // Check the response
        return promise.then(function(data) {
            Should(data).equal('Success!');
        });
    };

    /*
     * Tests that the promise is rejected for a given response code.
     */
    var testErrorResponseCode = function(method, responseCode) {
        var request = ASR(testURL);
        var promise = request[method.toLowerCase()]();

        promise.should.be.instanceOf(Promise);

        // Check that a request was sent properly
        requests.length.should.equal(1);
        var fakeXhr = requests[0];
        fakeXhr.url.should.equal(testURL);
        fakeXhr.method.should.equal(method);
        Should(fakeXhr.requestBody).not.be.ok; // body should be null or ''

        // Fake a successful response
        fakeXhr.respond(responseCode, {'Content-Type': 'application/json'}, 'Failure!');

        // Check that the promise was rejected
        return promise.then(function(/*data*/) {
            return Promise.reject(new Error('Promise should not resolve'));
        }, function(/*error*/) {
            // TODO: Check the message on the error. Need to figure out what we want to return
            return Promise.resolve(); // Not strictly necessary, but makes it a bit clearer what's happening
        });
    };

    /*
     * Tests that 200, 201, 202, and 204 resolve and that 400, 401, 403, and 404 reject.
     */
    var testAllResponseCodesForMethod = function(method) {
        it(method + ' with 200 response should succeed', function () {
            return testResponseCode(method, 200);
        });

        it(method + ' with 201 response should succeed', function () {
            return testResponseCode(method, 201);
        });

        it(method + ' with 202 response should succeed', function () {
            return testResponseCode(method, 202);
        });

        it(method + ' with 204 response should succeed', function () {
            return testResponseCode(method, 204);
        });

        it(method + ' with 400 response should fail', function () {
            return testErrorResponseCode(method, 400);
        });

        it(method + ' with 401 response should fail', function () {
            return testErrorResponseCode(method, 401);
        });

        it(method + ' with 403 response should fail', function () {
            return testErrorResponseCode(method, 403);
        });

        it(method + ' with 404 response should fail', function () {
            return testErrorResponseCode(method, 404);
        });
    };

    before(function() {
        ASR = ADSKSpark.Request;
        testURL = 'http://localhost';
    });

    beforeEach(function() {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function(request) {
            requests.push(request);
        };
    });

    afterEach(function() {
        xhr.restore();
    });

    it('should exist', function() {
        Should.exist(ASR);

        var request = ASR(testURL);

        Should.exist(request);
        request.should.be.Object.with.properties(['get', 'post', 'put', 'delete']);
    });

    context('GET', function() {
        testAllResponseCodesForMethod('GET');

        // Test sending data
        // For a GET request, it should be appended to the URL since a 'GET' has no request body
        it('should be able to send data', function() {
            var data = {
                field1: 'field',
                field2: 2
            };
            var dataURLString = '?field1=field&field2=2';
            var promise = ASR(testURL).get(undefined, data);

            promise.should.be.instanceOf(Promise);

            // Check that a request was sent properly
            requests.length.should.equal(1);
            var fakeXhr = requests[0];
            fakeXhr.url.should.equal(testURL + dataURLString);
            fakeXhr.method.should.equal('GET');
            Should(fakeXhr.requestBody).not.be.ok; // body should be null or ''

            // Fake a successful response
            fakeXhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify('success!'));

            return promise;
        });
    });

    context('POST', function() {
        testAllResponseCodesForMethod('POST');

        // Test sending data
        // For a POST request, the data should be put in the request's body without modification
        it('should be able to send data', function() {
            var data = {
                field1: 'field',
                field2: 2
            };
            var promise = ASR(testURL).post(undefined, data);

            promise.should.be.instanceOf(Promise);

            // Check that a request was sent properly
            requests.length.should.equal(1);
            var fakeXhr = requests[0];
            fakeXhr.url.should.equal(testURL);
            fakeXhr.method.should.equal('POST');
            Should(fakeXhr.requestBody).eql(data);

            // Fake a successful response
            fakeXhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify('success!'));

            return promise;
        });
    });

    context('PUT', function() {
        testAllResponseCodesForMethod('PUT');

        // Test sending data
        // For a PUT request, the data should be put in the request's body without modification
        it('should be able to send data', function() {
            var data = {
                field1: 'field',
                field2: 2
            };
            var promise = ASR(testURL).put(undefined, data);

            promise.should.be.instanceOf(Promise);

            // Check that a request was sent properly
            requests.length.should.equal(1);
            var fakeXhr = requests[0];
            fakeXhr.url.should.equal(testURL);
            fakeXhr.method.should.equal('PUT');
            Should(fakeXhr.requestBody).eql(data);

            // Fake a successful response
            fakeXhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify('success!'));

            return promise;
        });
    });

    context('DELETE', function() {
        testAllResponseCodesForMethod('DELETE');

        // Test sending data
        // For a DELETE request, the data should be put in the request's body without modification
        it('should be able to send data', function() {
            var data = {
                field1: 'field',
                field2: 2
            };
            var promise = ASR(testURL).delete(undefined, data);

            promise.should.be.instanceOf(Promise);

            // Check that a request was sent properly
            requests.length.should.equal(1);
            var fakeXhr = requests[0];
            fakeXhr.url.should.equal(testURL);
            fakeXhr.method.should.equal('DELETE');
            Should(fakeXhr.requestBody).eql(data);

            // Fake a successful response
            fakeXhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify('success!'));

            return promise;
        });
    });

});
