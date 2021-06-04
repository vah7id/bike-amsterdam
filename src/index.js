
import * as THREE from "three";
import { WebGLRenderer, Scene, PerspectiveCamera, PointLight, AmbientLight } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { preloader } from "./loader";
import { GLTFResolver } from "./loader/resolvers/GLTFResolver";
import { createMeshWithTexture } from "./meshHelper";
   

/* Init renderer and canvas */
const container = document.body;
const bridgeObjects = [];
const renderer = new WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor("white");
container.style.overflow = "hidden";
container.style.margin = 0;
container.appendChild(renderer.domElement);

let xAxis = 10;


/* Main scene and camera */
const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1, 
  1000
);
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 10;
camera.position.y = 0;
// camera.position.x = -500;

// controls.enabled = false;

/* Lights */
const ambientLight = new AmbientLight(0xffffff, 0.8);
const frontLight = new PointLight(0xffffff, 0.8);
const backLight = new PointLight(0xffffff, 0.8);
frontLight.castShadow = false;
frontLight.shadow.mapSize.width = 1024;
frontLight.shadow.mapSize.height = 1024;
backLight.castShadow = false;
backLight.shadow.mapSize.width = 1024;
backLight.shadow.mapSize.height = 1024;
frontLight.position.set(20, 20, 20);
backLight.position.set(-20, -20, 20);
scene.add(frontLight);
scene.add(backLight);
scene.add(ambientLight);

/* Various event listeners */
window.addEventListener("resize", onResize);
    
// Loading the cool bike model
preloader.init(new GLTFResolver());
preloader
  .load([{ id: "model", type: "gltf", url: "../assets/bike2.gltf" }])
  .then(([model]) => {
    onResize();
    animate();

    const obj = model.scene.scene;
    obj.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = obj.receiveShadow = true;
      }
    });

    obj.position.x = -5;
    obj.position.y = 2;
    obj.position.z = 0;

    scene.add(obj);

    const backgroundPlane = createMeshWithTexture("../assets/bg-amsterdam-6-web.jpeg", 10, -Math.PI/30, 10, -5, 400, 1000, 20);
    scene.add(backgroundPlane);


    const brickWall = createMeshWithTexture("../assets/stone-texture.jpg", 50, -Math.PI/30, -2.5, 2, 0, 1000, 5);
    scene.add(brickWall);
});

    
const renderBridge = (x, y, z) => {
  // Loading the brdige model
  preloader
  .load([{ id: "model", type: "gltf", url: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/bridge-01/model.gltf" }])
  .then(([model]) => {
    onResize();
    animate();

    let obj = model.scene.scene;

    obj.position.x = x;
    obj.position.y = y;
    obj.position.z = z;
    obj.scale.set(2,1.5,3);

    scene.add(obj);
    
    bridgeObjects.push(obj);
  });
}

for(let i = 0 ; i < 8 ; i++) {
  renderBridge(-12 + (i*6), 0, -1);
}

const onKeyDown = (event) => {
	const step = 0.5;
  switch ( event.keyCode ) {
		case 39:
      xAxis += step * 10;

      if (xAxis > 30 - 12 ) renderBridge(xAxis + 12, 0, -1);
			camera.position.x += step;
			break;
	}
}


document.addEventListener( 'keydown', onKeyDown, false );

/**
 Resize canvas
*/
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 RAF
*/
function animate() {
window.requestAnimationFrame(animate);
  render();
}

/**
 Render loop
*/
function render() {
  //controls.update();
  renderer.clear();
  renderer.render(scene, camera);
}


