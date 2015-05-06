## Spark Print SDK Test Suite

### How to Install
Run `npm install` in the parent directory.

### How to Run
Run `karma start karma.conf.js` or `npm test` in the parent directory.

### How to add a test
1. Create the test cases in the appropriate \*Spec.js file, if not already existent.

#### Mocha
This describes the suite and the different test cases.  The important methods are:
* `describe`, to signal the start of the suite, and `it` to signal the start of a test case.
* `done` - this signals the end of the test.  Because the REST calls are asynchronous, you should call this somewhere in * the callback you pass into the helper methods of TestServer.
* If you need to do some setup before and/or after each suite (ie. the code within `describe`), you can call `before` and/or `after`
* If you need to do some setup before and/or after each test (ie. the code within `it`), you can call `beforeEach` and/or `afterEach`.  For the existing tests, `afterEach` was used to do some cleanup of files that were created during the test.
* If you want to run only a specific suite or test, you can append `only` - ie. `describe.only(…)`, `it.only(…)`.  This is useful if you’re debugging a specific set of functionality.
* If you want to skip particular suites or tests, you can append `skip`, -ie. `describe.skip(…)`, `it.skip(…)`.  This is useful if you want to omit specific tests.
* More API documentation found here:  [http://mochajs.org/](http://mochajs.org/)

#### Should
This is used for asserting correctness.  These will read like plain English.  Basic methods are:
```
<value>.should.equal(<other_value>)
<value>.should.not.equal(<other_value>)
should.not.exist(<value>)
<object>.should.have.property(<property>)
```
More API documentation found here:  [http://shouldjs.github.io/](http://shouldjs.github.io/)

### Sinon
This is used for faking XHR requests so that we don't need to connect to an actual server. See `test/RequestSpec.js` for an example.

More API documentation found here: [http://sinonjs.org/docs/](http://sinonjs.org/docs/)

