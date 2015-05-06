describe('Mesh API tests', function() {
    'use strict';

    var MeshApi = ADSKSpark.MeshAPI;


    before(function() {
    });

    beforeEach(function() {
        var testApiUrl = 'http://localhost:9998';
        ADSKSpark.Client.initialize(null, null, null, testApiUrl);
    });

    afterEach(function() {
    });

    it('Should exist', function(done) {
        Should.exist(MeshApi);

        MeshApi.should.be.Object.with.properties(['importMesh']);
        done();
    });

    it('Should fail importing a bogus mesh', function(done) {
        return MeshApi.importMesh('FUBAR_MESH_ID', 'NONAME')
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
