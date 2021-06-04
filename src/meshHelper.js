
import * as THREE from "three";

export const createMeshWithTexture = (texturePath, repeatX, rotateX, posY, posZ, posX, sizex, sizey) => {
    var textureLoader = new THREE.TextureLoader();
    var backgroundTexture = textureLoader.load( texturePath );
    // assuming you want the texture to repeat in both directions:
    backgroundTexture.wrapS = THREE.RepeatWrapping; 
    // backgroundTexture.wrapT = THREE.RepeatWrapping;
    
    // how many times to repeat in each direction; the default is (1,1),
    //   which is probably why your example wasn't working
    backgroundTexture.repeat.set( repeatX, 1 ); 
    const backgroundMaterial = new THREE.MeshBasicMaterial( { map: backgroundTexture } );
    const backgroundPlane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(sizex, sizey),
        backgroundMaterial
    );
    backgroundPlane.rotation.x = rotateX;
    backgroundPlane.position.y = posY;
    backgroundPlane.position.z = posZ;
    backgroundPlane.position.x = posX;

    return backgroundPlane;
}