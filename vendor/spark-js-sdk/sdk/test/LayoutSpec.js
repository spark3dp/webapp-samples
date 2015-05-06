describe('PrintLayout class', function() {
    'use strict';

    var emberType = {
        "id": "7FAF097F-DB2E-45DC-9395-A30210E789AA",
        "version": 1,
        "name": "Ember",
        "manufacturer": "Autodesk",
        "model_number": "1.0.0",
        "registration_url" : null,
        "icon_id": "data/ember.png",
        "icon50x50_id": "data/ember50x50.png",
        "icon100x100_id": "data/ember100x100.png",
        "technology": "DLP",
        "default_material_id": "426F14FE-E6AF-496F-BBC7-7D6C0E16861D",
        "default_profile_id": "34F0E39A-9389-42BA-AB5A-4F2CD59C98E4",
        "firmware": {
            "type": "Ember",
            "version": "1.0.0"
        },
        "build_volume": {
            "type": "Cartesian",
            "bed_size": [
                6.40000000000000,
                4.00000000000000,
                13.40000000000000
            ],
            "bed_offset": [
                -3.200000000000000,
                -2.000000000000000,
                0.000000000000000
            ],
            "home_position": [0, 0, 0],
            "park_position": [0, 0, 0],
            "bed_file_id": "data/ember.zip"
        },
        "max_materials": 1,
        "printable": {
            "content": "image/png+tar.gz",
            "thumbnail": "image/png",
            "extension": "tar.gz",
            "generates_supports": false,
            "packager_file_id": "data/EmberPackager.lua"
        },
        "supported_connections": [
            {
                "type": "bonjour",
                "protocol": "_http._tcp",
                "info" : {
                    "port": 3000,
                    "service_name": "Ember",
                    "api": {
                        "name": "SparkPrint",
                        "version": "1.0.0"
                    }
                }
            },
            {
                "type": "LAN",
                "protocol": "_http._tcp",
                "info": {
                    "port": 3000,
                    "api": {
                        "name": "SparkPrint",
                        "version": "1.0.0"
                    }
                }
            }
        ],
        "preferred_connection": "bonjour",
        "max_speeds": {
            "z": 0.1
        },
        "software_info": {
            "name": "Spark Print Studio",
            "url": "www.spark.autodesk.com"
        },
        "printer_capabilities": {},
        "_files": [
            "icon_id",
            "icon50x50_id",
            "icon100x100_id",
            "build_volume.bed_file_id",
            "printable.packager_file_id"
        ]
    };


    before(function() {
    });

    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('Should exist and be constructable', function() {
        Should.exist(ADSKSpark.PrintLayout);

        var layout = new ADSKSpark.PrintLayout(emberType);

        Should.exist(layout);
        layout.should.be.Object;
    });

    describe('Basic Methods', function() {
        it('get methods', function(done) {
            var layout = new ADSKSpark.PrintLayout(emberType);

            Should(layout.getId()).equal(null); // Id may not be exposed in future

            layout.getName().should.be.String;
            layout.getName().should.not.be.equal("TEST LAYOUT");
            layout.setName("TEST LAYOUT").should.equal(true);
            layout.getName().should.be.equal("TEST LAYOUT");

            var models = layout.getModels();
            models.should.be.Array;
            models.length.should.equal(0);

            done();
        });

        it('should be unlocked and unlockable', function(done) {
            var layout = new ADSKSpark.PrintLayout(emberType);

            layout.getLock().should.equal(false);
            layout.setLock().should.equal(false);

            done();
        });
    });

});
