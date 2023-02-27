// Configura el contexto ARToolKit
var arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam"
  });
  
  arToolkitSource.init(function onReady() {
    onResize();
  });
  
  window.addEventListener("resize", function() {
    onResize();
  });
  
  function onResize() {
    arToolkitSource.onResize();
    arToolkitSource.copySizeTo(renderer.domElement);
  }
  
  var arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl:
      "https://raw.githubusercontent.com/nicolocarpignoli/nicolocarpignoli.github.io/master/assets/arjs/camera_para.dat",
    detectionMode: "mono",
    maxDetectionRate: 30,
    canvasWidth: arToolkitSource.parameters.sourceWidth,
    canvasHeight: arToolkitSource.parameters.sourceHeight
  });
  
  arToolkitContext.init(function onCompleted() {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });
  
  // Configura la escena Three.js
  var scene = new THREE.Scene();
  
  var camera = new THREE.Camera();
  scene.add(camera);
  
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(new THREE.Color("lightgrey"), 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0px";
  renderer.domElement.style.left = "0px";
  document.body.appendChild(renderer.domElement);
  
  // Agrega una luz ambiental a la escena
  var ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
  scene.add(ambientLight);
  
  // Agrega una luz puntual a la escena
  var pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  
  // Carga el modelo 3D en formato glTF
  var loader = new THREE.GLTFLoader();
  loader.load(
    "https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb",
    function(gltf) {
      modelObject = gltf.scene;
      modelObject.visible = false;
      scene.add(modelObject);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  
  // Crea un objeto Three.js para el marcador
  var markerObject = new THREE.Object3D();
  scene.add(markerObject);
  
  // Actualiza la escena y la posición del objeto del marcador
  function update() {
    // Actualiza el contexto ARToolKit
    arToolkitContext.update(arToolkitSource.domElement);
    markerObject.visible = camera.visible;
  
    // Ajusta el objeto del marcador a la posición de la cámara
    var position = new THREE.Vector3();
    camera.getWorldPosition(position);
    modelObject.position.copy(position);
  
    renderer.render(scene, camera);
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);  