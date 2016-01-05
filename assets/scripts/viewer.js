(function () {
    'use strict';

    //threejs global vars
    var camera, scene, renderer, controls, mesh, light, backlight;

    // RENDER LOOP
    var render = function () {
        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, camera);
    };

     function Viewer(){
        return {
            init: function (elem, dimensions) {
                // SCENE BASIC SETUP
                //
                //SCREEN_WIDTH = 622;
                //SCREEN_HEIGHT = 300;

                scene = new THREE.Scene();
                scene.fog = new THREE.Fog(0xb5b5b5, 500, 3000);

                renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
                renderer.setSize(dimensions.width, dimensions.height);
                renderer.setClearColor(0xffffff);
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.soft = true;
                renderer.shadowMap.type = THREE.PCFShadowMap;

                // APPEND RENDERER
                elem.prepend(renderer.domElement);

                // CAMERA & CONTROLS
                var VIEW_ANGLE = 45;
                var ASPECT = dimensions.width / dimensions.height;
                var NEAR = 0.2;
                var FAR = 2000;
                camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

                camera.position.set(-100, 20, 10);

                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.maxDistance = 1600;

                // LIGHTS
                var ambient = new THREE.AmbientLight(0x444444);
                scene.add(ambient);

                light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2, 1);
                light.position.set(100, 1000, 1000);
                light.target.position.set(0, 0, 0);
                light.castShadow = true;
                light.shadowCameraNear = 1200;
                light.shadowCameraFar = 2500;
                light.shadowCameraFov = 1;
                light.shadowMapWidth = 2048;
                light.shadowMapHeight = 2048;
                light.shadowBias = 0.0001;
                light.shadowDarkness = 0.2;
                light.shadowMapWidth = 1024;
                light.shadowMapHeight = 1024;

                scene.add(light);

                backlight = new THREE.SpotLight(0xffff00, 1, 0, Math.PI / 2, 1);
                backlight.position.set(0, 50, -800);
                backlight.target.position.set(0, 0, 0);
                backlight.castShadow = true;
                backlight.shadowCameraNear = 1200;
                backlight.shadowCameraFar = 2500;
                backlight.shadowCameraFov = 1;
                backlight.shadowMapWidth = 2048;
                backlight.shadowMapHeight = 2048;
                backlight.shadowBias = 0.0001;
                backlight.shadowDarkness = 0.2;
                backlight.shadowMapWidth = 1024;
                backlight.shadowMapHeight = 1024;

                scene.add(backlight);

                var size = 200;
                var step = 10;

                var gridHelper = new THREE.GridHelper(size, step);
                gridHelper.setColors(0xaaaaaa, 0xe0e0e0);
                scene.add(gridHelper);

                //render everything
                render();
            },

            loadObject: function (src, type, callback) {
                var loader;

                switch (type) {
                    case 'stl':
                        loader = new THREE.STLLoader();
                        break;
                    case 'obj':
                        loader = new THREE.OBJLoader();
                        break;
                    default:
                        alert('This file type is currently not supported!');
                        return;
                }

                loader.load(src, function (geometry) {
                    var geom = (type === 'stl') ? geometry : geometry.children[0].geometry;
                    var material = new THREE.MeshPhongMaterial({color: 0xAAAAAA, specular: 0x111111, shininess: 200});
                    geom.center();
                    mesh = new THREE.Mesh(geom, material);

                    scene.add(mesh);
                    controls.autoRotate = true;
                    if (callback) {
                        callback();
                    }
                });
            },
            stopRotation: function () {
                controls.autoRotate = false;
            }
        };

    }

    window.Viewer = Viewer();

})();