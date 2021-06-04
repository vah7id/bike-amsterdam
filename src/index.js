
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

const logo = document.createElement('img');
logo.setAttribute('src', '../assets/logo.png');
logo.style.zIndex = 1000;
logo.style.position = 'fixed';
logo.style.right = '0px';
logo.style.top = '0px';
logo.style.width = '150px';


container.appendChild(logo);

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
camera.position.y = 5;
camera.position.x = 5;


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

    obj.name = 'bike';

    scene.add(obj);

    const backgroundPlane = createMeshWithTexture("../assets/bg-amsterdam-6-web.jpeg", 20, -Math.PI/30, 10, -5, 400, 1000, 20);
    scene.add(backgroundPlane);


    const brickWall = createMeshWithTexture("../assets/canal.jpg", 50, -Math.PI/30, -2.5, 2, 0, 1000, 5);
    scene.add(brickWall);
});

    
const renderBridge = (x, y, z, i = null) => {
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
    obj.scale.set(2,2,3);

    scene.add(obj);
    
    if (i !== null) bridgeObjects[i] = obj;
    if (!i) bridgeObjects.push(obj);
  });
}

const unloadBridgeLeft = () => {
  scene.remove(bridgeObjects[0]);
  bridgeObjects.shift();
}

const bridgeWidth = 6;

for(let i = 0 ; i < 7 ; i++) {
  renderBridge(-12 + (i*bridgeWidth), 0, -1, i);
}

const onKeyDown = (event) => {
	const step = 0.5;
  switch ( event.keyCode ) {
		case 39:
      xAxis += step * 10;
      let bikeObject = scene.getObjectByName('bike');
      bikeObject.position.x += step;
      if(xAxis % 2 === 0) {
        bikeObject.position.z -= 0.1;
        bikeObject.position.y -= 0.05;
      } else {
        bikeObject.position.z += 0.1;
        bikeObject.position.y += 0.05;
      }

			camera.position.x += step;
      if (xAxis === 40 ) {
        renderBridge(camera.position.x + 18, 0, -1);
        unloadBridgeLeft();
      }
      // still too frequent but good enough
      if (xAxis > 40 &&  xAxis % 60 === 0 ) {
        renderBridge(camera.position.x + 24, 0, -1);
        unloadBridgeLeft();
      }
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
  renderer.clear();
  renderer.render(scene, camera);
}


