describe('Tray API tests', function() {
    'use strict';

    var TrayApi = ADSKSpark.TrayAPI;


    before(function() {
    });

    beforeEach(function() {
        var testApiUrl = 'http://localhost:9998';
        ADSKSpark.Client.initialize(null, null, null, testApiUrl);
    });

    afterEach(function() {
    });

    it('Should exist', function(done) {
        Should.exist(TrayApi);

        TrayApi.should.be.Object.with.properties(['createTray', 'prepareTray']);
        done();
    });

    it('Should fail creating a bogus tray', function(done) {
        return TrayApi.createTray('BAD_PRINTER', 'BAD_PROFILE', ['BAD_MESH'])
            .then(function() {
                done(new Error('THIS SHOULD NOT HAVE WORKED'));
            })
            .catch(function(err) {
                err.message.should.startWith('400');
                done(); // Correct result!!
            })
            // Catch should failures:
            .catch(function(fail) {
                done(fail);
            });
    });

});
