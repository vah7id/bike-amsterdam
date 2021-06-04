
import * as THREE from "three";

export const createMeshWithTexture = () => {
    var textureLoader = new THREE.TextureLoader();
    var backgroundTexture = textureLoader.load( "../assets/bg-amsterdam-6-web.jpeg" );
    // assuming you want the texture to repeat in both directions:
    backgroundTexture.wrapS = THREE.RepeatWrapping; 
    // backgroundTexture.wrapT = THREE.RepeatWrapping;
    
    // how many times to repeat in each direction; the default is (1,1),
    //   which is probably why your example wasn't working
    backgroundTexture.repeat.set( 50, 1 ); 
    const backgroundMaterial = new THREE.MeshBasicMaterial( { map: backgroundTexture } );
    const backgroundPlane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(1000, 20),
        backgroundMaterial
    );
    // backgroundPlane.rotateOnAxis(new Vector3(1, 0,0), 90);
    backgroundPlane.rotation.x = -Math.PI/30;
    backgroundPlane.position.y = 10;
    backgroundPlane.position.z = -10;

    return backgroundPlane;
}