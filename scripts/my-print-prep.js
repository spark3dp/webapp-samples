/**
 * Created by roiyarden on 3/26/15.
 */

var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var manager = new THREE.LoadingManager();
var loader = new THREE.OBJLoader( manager );

init();
animate();


function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight,  0.1, 1000 );
	camera.position.z = 200;

	// scene

	scene = new THREE.Scene();

	var ambient = new THREE.AmbientLight( 0x101030 );
	scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 1 );
	scene.add( directionalLight );

	// texture

	manager.onProgress = function ( item, loaded, total ) {

		console.log( item, loaded, total );

	};


	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

	mouseX = ( event.clientX - windowHalfX ) / 1.5;
	mouseY = ( event.clientY - windowHalfY ) / 1.5;

}

//

function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {

	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;

	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}

function showObjOnScene(){
	var objText = sparkPrintPrep.getDownlaodFileData();
	var object = loader.parse(objText);
	object.position.y =  -20;
	scene.add( object );
	render();

}

function updateFieldAndEnable(){
	document.getElementById('meshId').value = sparkPrintPrep.getMeshId();
	document.getElementById('meshProblems').value = sparkPrintPrep.getProblems();
	$("#btn-div").prop("disabled",false);
	$("#btn-div").children().prop("disabled",false);
	$("#btn-div").removeClass("loader-print");

}

function disableButtons(){
	$("#btn-div").prop("disabled",true);
	$("#btn-div").children().prop("disabled",true);
	$("#btn-div").addClass("loader-print");
}
var events = {};
events['load'] = updateFieldAndEnable;

$( "#import" ).click(function() {
	disableButtons();
	var fileSelect = document.getElementById('file-select');
	var files = fileSelect.files;
	sparkPrintPrep.uploadFileAndImport(files,events);
});
$( "#analyze" ).click(function() {
	disableButtons();
	sparkPrintPrep.analyzeMesh(events);

});
$( "#repair" ).click(function() {
	disableButtons();
	sparkPrintPrep.repairMesh(events);

});
$( "#export" ).click(function() {
	disableButtons();
	sparkPrintPrep.exportMesh(events);

});
$( "#load" ).click(function() {
	showObjOnScene();
});

$("#file-select").on('change',  function() {

	var filename = document.getElementById('file-select').files[0].name ;
	document.getElementById('file-name').value = filename;

});