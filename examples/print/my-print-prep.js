/**
 * Created by roiyarden on 3/26/15.
 */

var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var canvasHeight = 500;
var canvasWidth = 800;
var manager = new THREE.LoadingManager();
var loader = new THREE.OBJLoader( manager );

init();
animate();

var lastObj;

function init() {


	container = $('<div style="text-align: center;"></div>');
	$("#canvas").append(container);

	camera = new THREE.PerspectiveCamera( 75, canvasWidth / canvasHeight,  0.1, 1000 );
	camera.position.z = 200;


	//camera.position.set( 0.0, radius, radius * 3.5 );


	var controls;

	//controls = new THREE.OrbitControls( camera );
	//controls.target = new THREE.Vector3( 0, radius, 0 );
	//controls.update();
	// scene

	controls = new THREE.OrbitControls( camera,container.get(0) );
//        controls.damping = 0.2;
	controls.addEventListener( 'change', render );

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
	renderer.setSize( canvasWidth, canvasHeight );
	container.append( renderer.domElement );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

/**function onDocumentMouseMove( event ) {

	mouseX = ( event.clientX - windowHalfX ) / 1.5;
	mouseY = ( event.clientY - windowHalfY ) / 1.5;

}*/

//

function animate() {

	requestAnimationFrame( animate );
	render();

};

function render() {

	//camera.position.x += ( mouseX - camera.position.x ) * .05;
	//camera.position.y += ( - mouseY - camera.position.y ) * .05;

	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}

function modelLoadedCallback(geometry){
	var material = new THREE.MeshLambertMaterial();

	var mesh = new THREE.Mesh( geometry, material );
	//mesh.name = object.name;
	var group = new THREE.Object3D();
	group.add(mesh);
	group.y = -20;
	scene.add( group );
}

function showObjOnScene(downloadData){
	var object = loader.parse(downloadData);

	//var loader2 = new THREE.JSONLoader();
	//loader2.load('http://localhost:8888/mouse-tracking/models/cube.js', modelLoadedCallback);

	if(lastObj!=undefined){
		scene.remove( lastObj );
	}

	lastObj = object;
	scene.add( object );
	render();
}

function loadProblemsOnScene(downloadData){
	var objects = [];

	var problems = "";
	for(var i in downloadData) {
		if (downloadData[i].triangles != undefined) {
			for (var j in downloadData[i].triangles) {
				for(var k in downloadData[i].triangles[j])
				problems += "v " + downloadData[i].triangles[j][k][0] + " " + downloadData[i].triangles[j][k][1] + " " + downloadData[i].triangles[j][k][2] + " \n";
			}
		}
		var object = loader.parse(problems);
		object.position.y = -20;
		scene.add(object);
		render();
	}

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
		loadProblemsOnScene(response.problems);
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

$( "#createTray" ).click(function() {
	disableButtons();
	var meshId=document.getElementById('meshId').value;
	//var downloadFileId = document.getElementById('downloadFileId').value;
	var printerTypeId= "7FAF097F-DB2E-45DC-9395-A30210E789AA";
	var profileId="34F0E39A-9389-42BA-AB5A-4F2CD59C98E4";

	sparkPrintPrep.createTray(meshId, printerTypeId, profileId, function(response){
		document.getElementById('trayId').value = response.id;

		EnableButtons();
	});

});

$( "#prepareTray" ).click(function() {
	disableButtons();
	var trayId=document.getElementById('trayId').value;

	sparkPrintPrep.prepareTray(trayId, function(response){
		document.getElementById('trayId').value = response.id;
		document.getElementById('meshId').value = response.meshes[0].id;

		EnableButtons();
	});

});

$( "#generatePrintable" ).click(function() {
	disableButtons();
	var trayId=document.getElementById('trayId').value;

	sparkPrintPrep.generatePrintable(trayId, function(response){
		document.getElementById('printableId').value = response.file_id;
		EnableButtons();
	});

});



$("#file-select").on('change',  function() {

	var filename = document.getElementById('file-select').files[0].name ;
	document.getElementById('file-name').value = filename;

});