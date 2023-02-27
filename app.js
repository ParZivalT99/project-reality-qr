// Obtiene la escena de A-Frame
var scene = document.querySelector('a-scene');

// Crea un objeto para el modelo GLB
var modelObject = document.createElement('a-entity');
modelObject.setAttribute('gltf-model', 'url(model.glb)');
modelObject.setAttribute('scale', '0.01 0.01 0.01');

// Agrega el objeto del modelo a la escena de A-Frame
scene.appendChild(modelObject);

// Inicializa AR.js
var arToolkitSource = new THREEx.ArToolkitSource({
  sourceType: 'webcam'
});

var arToolkitContext = new THREEx.ArToolkitContext({
  detectionMode: 'mono',
  maxDetectionRate: 30,
  canvasWidth: 640,
  canvasHeight: 480
});

// Configura la cámara de la escena de A-Frame para utilizar la cámara de AR.js
arToolkitSource.init(function onReady() {
  setTimeout(function() {
    var camera = document.querySelector('[camera]');
    camera.setAttribute('camera', 'active', false);
    arToolkitContext.arController.setPatternDetectionMode(artoolkit.AR_MATRIX_CODE_DETECTION);
    arToolkitContext.arController.setMatrixCodeType(artoolkit.AR_MATRIX_CODE_3x3_HAMMING63);
    arToolkitContext.arController.setPattRatio(0.5);
    arToolkitContext.arController.setMatrixCodeType(artoolkit.AR_MATRIX_CODE_3x3_HAMMING63);
    arToolkitContext.arController.setThresholdMode(artoolkit.AR_LABELING_THRESH_MODE_AUTO_OTSU);
    arToolkitContext.arController.setThreshold(120);
    arToolkitContext.arController.setPatternDetectionMode(artoolkit.AR_MATRIX_CODE_DETECTION);
    arToolkitContext.arController.setMatrixCodeType(artoolkit.AR_MATRIX_CODE_3x3_HAMMING63);
    arToolkitContext.arController.setPattRatio(0.5);
    arToolkitContext.arController.setThresholdMode(artoolkit.AR_LABELING_THRESH_MODE_AUTO_OTSU);
    arToolkitContext.arController.setThreshold(120);
  }, 2000);
});

arToolkitContext.init(function onCompleted() {
  camera = arToolkitContext.arController.getCamera();

  // Crea un objeto para mostrar la cámara en la escena de A-Frame
  var cameraObject = new THREE.Object3D();
  cameraObject.matrixAutoUpdate = false;
  cameraObject.visible = false;
  cameraObject.matrix.copy(camera.matrix);

  // Agrega la cámara a la escena de A-Frame
  var cameraWrapper = document.createElement('a-entity');
  cameraWrapper.object3D.add(cameraObject);
  scene.appendChild(cameraWrapper);

  // Crea un objeto para el marcador
  var markerObject = new THREE.Object3D();
  markerObject.matrixAutoUpdate = false;

  // Agrega el objeto del marcador a la escena de A-Frame
  var markerWrapper = document.createElement('a-entity');
  markerWrapper.object3D.add(markerObject);
  scene.appendChild(markerWrapper);

  // Renderiza la escena de A-Frame y AR.js
  requestAnimationFrame(function render() {
    arToolkitContext.update(arToolkitSource.domElement);
    cameraObject.matrix.copy(camera.matrix);

    // Ajusta el modelo a la posición de la cámara
    modelObject.setAttribute('position', cameraObject.position);
    modelObject.setAttribute('rotation', cameraObject.rotation);
    modelObject.object3D.visible = true;

    // Ajusta el objeto del marcador a la posición de la cámara
    markerObject.matrix.copy(camera.matrix);
    // Configura el marcador NFT
var nftMarker = new THREEx.ArMarkerNFT(arToolkitContext, markerObject, {
    type: 'nft',
    url: 'marker.patt'
  });
  
  // Agrega el marcador NFT a la escena de AR.js
  arToolkitContext.arController.loadMarker(nftMarker.id, 'marker.patt');
  
  // Cuando se detecta el marcador, muestra el objeto del modelo
  nftMarker.addEventListener('markerFound', function() {
    modelObject.object3D.visible = true;
  });
  
  // Cuando se pierde el marcador, oculta el objeto del modelo
  nftMarker.addEventListener('markerLost', function() {
    modelObject.object3D.visible = false;
  });
  
  // Renderiza la escena de A-Frame y AR.js
  requestAnimationFrame(render);
  });
});