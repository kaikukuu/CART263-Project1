import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export const items = [];

function createItem(name) {
    const group = new THREE.Group();
    group.name = name;
    items.push({ group, name });
    return group;
}

const shellItem = createItem('shell');
shellItem.position.set(-10, 1, 0);
const shellLoader = new GLTFLoader();
shellLoader.load('../models/shell.glb', (gltf) => {
    const object = gltf.scene || gltf;
    const scale = 2; // Larger size
    object.scale.set(scale, scale, scale);
    object.traverse(child => {
        if (child.isMesh) child.castShadow = true;
    });
    shellItem.add(object);
    console.log('shell model loaded', object);
}, undefined, (error) => {
    console.error('shell model load error', error);
});

const phnItem = createItem('rotary_phn');
phnItem.position.set(10, 1, 0);
const phnLoader = new FBXLoader();
phnLoader.load('../models/rotary_phn.fbx', (object) => {
    object.scale.set(0.05, 0.05, 0.05);
    object.traverse(child => {
        if (child.isMesh) child.castShadow = true;
    });
    phnItem.add(object);
    console.log('rotary_phn model loaded', object);
}, undefined, (error) => {
    console.error('rotary_phn model load error', error);
});


//STEP 4:
//TODO: Use raycasting in the click() method below to detect clicks on the models, and make an animation happen when a model is clicked.
//TODO: Use your imagination and creativity!
// this.group.add(this.sphere, this.cloud, this.glow, this.glow2);
// this.scene.add(this.group);
//     }

// update(delta) {
//     // Orbit around sun
//     this.angle += this.orbitSpeed * delta * 30;
//     this.group.position.x = Math.cos(this.angle) * this.orbitRadius;
//     this.group.position.z = Math.sin(this.angle) * this.orbitRadius;

//     // Rotate planet
//     this.group.rotation.y += delta * 0.5;

//     // Animate model bounce if active
//     if (this.model && this.bounceTime > 0) {
//         this.model.position.y = this.originalY + Math.sin(this.bounceTime * 4) * 0.3; // bounce up and down
//         this.bounceTime -= delta * 3; // slow down over time
//         if (this.bounceTime < 0) this.bounceTime = 0; // stop
//     }

//     //TODO: Do the moon orbits and the model animations here.
//     //makes all the moons orbit around the planet
//     this.group.children.forEach(child => {
//         if (child.userData.orbitRadius) {
//             child.userData.angle += child.userData.orbitSpeed * delta * 3;
//             child.position.x = Math.cos(child.userData.angle) * child.userData.orbitRadius;
//             child.position.z = Math.sin(child.userData.angle) * child.userData.orbitRadius;
//         }
//     });

// }

// click(mouse, scene, camera) {
//     //Raycasting to detect clicks on the model
//     if (this.model) {
//         const raycaster = new THREE.Raycaster();
//         raycaster.setFromCamera(mouse, camera);
//         const intersects = raycaster.intersectObject(this.model, true); // check for intersection with the model and its children
//         if (intersects.length > 0) {
//             console.log("intersected");
//             // Start bounce animation
//             this.bounceTime = Math.PI * 2; // about 2 seconds of bouncing
//         }
//     }
// };
