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

function showObjOnScene(downloadData){
	var object = loader.parse(downloadData);
	object.position.y =  -20;
	scene.add( object );
	render();

}

function EnableButtons(){
	$("#btn-div").prop("disabled",false);
	$("#btn-div").children().prop("disabled",false);
	$("#btn-div").removeClass("loader-print");

}

function disableButtons(){
	$("#btn-div").prop("disabled",true);
	$("#btn-div").children().prop("disabled",true);
	$("#btn-div").addClass("loader-print");
}

$( "#import" ).click(function() {
	disableButtons();
	var fileSelect = document.getElementById('file-select');
	var files = fileSelect.files;
	sparkPrintPrep.uploadFileAndImport(files,function(response){
		console.log(response);
		document.getElementById('meshId').value = response.id;
		EnableButtons();
	});
});

var analyzeAndRepairCallback = function(response){
	document.getElementById('meshId').value = response.id;

	var problems ='';
	if (response.problems.length ==0){
		problems = 'No Problems!';
	}
	else{
		problems = JSON.stringify(response.problems);
	}
	document.getElementById('meshProblems').value = problems;
	EnableButtons();
};

$( "#analyze" ).click(function() {
	disableButtons();
	sparkPrintPrep.analyzeMesh(document.getElementById('meshId').value, analyzeAndRepairCallback);
});

$( "#repair" ).click(function() {
	disableButtons();
	sparkPrintPrep.repairMesh(document.getElementById('meshId').value,analyzeAndRepairCallback);
});

$( "#export" ).click(function() {
	disableButtons();
	sparkPrintPrep.exportMesh(document.getElementById('meshId').value,function(response){

		document.getElementById('downloadFileId').value = response.file_id;
		EnableButtons();
	});
});

$( "#load" ).click(function() {
	disableButtons();
	var downloadFileId = document.getElementById('downloadFileId').value;
	sparkPrintPrep.downloadFile(downloadFileId, function(response){
		showObjOnScene(response);
		EnableButtons();
	});

});

$("#file-select").on('change',  function() {

	var filename = document.getElementById('file-select').files[0].name ;
	document.getElementById('file-name').value = filename;

});