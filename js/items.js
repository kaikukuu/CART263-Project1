import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export const items = [];

function createItem(name) {
    const group = new THREE.Group();
    group.name = name;
    // // Add a red box for debugging
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // const cube = new THREE.Mesh(geometry, material);
    // group.add(cube);
    items.push({ group, name });
    return group;
}

const shellItem = createItem('shell');
shellItem.position.set(11.5, 55, 2);
shellItem.rotation.y = 45;
const shellLoader = new GLTFLoader();
shellLoader.load('../models/shell.glb', (gltf) => {
    const object = gltf.scene || gltf;
    const scale = 12; // Adjusted size
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
phnItem.position.set(10, 5.2, 1);
const phnLoader = new FBXLoader();
phnLoader.load('../models/old_rotary_phn.fbx', (object) => {
    object.scale.set(0.1, 0.1, 0.1);
    object.traverse(child => {
        if (child.isMesh) child.castShadow = true;
    });
    phnItem.add(object);
    console.log('rotary_phn model loaded', object);
}, undefined, (error) => {
    console.error('rotary_phn model load error', error);
});

const vintageLamp = createItem('vintage_lamp');
vintageLamp.position.set(9, 4.75, -1);
const lampLoader = new GLTFLoader();
lampLoader.load('../models/vintage_lamp.glb', (gltf) => {
    const object = gltf.scene || gltf;
    const scale = 0.3; // Adjusted size
    object.scale.set(scale, scale, scale);
    object.traverse(child => {
        if (child.isMesh) child.castShadow = true;
    });
    vintageLamp.add(object);
    console.log('vintage_lamp model loaded', object);
}, undefined, (error) => {
    console.error('vintage_lamp model load error', error);
});

// const clockItem = createItem('clock');
// clockItem.position.set(8.5, 1, 0);
// const clockLoader = new GLTFLoader();
// clockLoader.load('../models/wall_clock.glb', (gltf) => {
//     const object = gltf.scene || gltf;
//     const scale = 0.1;  // Adjusted size
//     object.scale.set(scale, scale, scale);
//     object.traverse(child => {
//         if (child.isMesh) child.castShadow = true;
//     });
//     clockItem.add(object);
//     console.log('clock model loaded', object);
// }, undefined, (error) => {
//     console.error('clock model load error', error);
// });

const tableItem = createItem('table');
tableItem.position.set(10, 2.5, 0);
const tableLoader = new GLTFLoader();
tableLoader.load('../models/ornate_table.glb', (gltf) => {
    const object = gltf.scene || gltf;
    const scale = 5;  // Adjusted size
    object.scale.set(scale, scale, scale);
    object.traverse(child => {
        if (child.isMesh) child.castShadow = true;
    });
    tableItem.add(object);
    console.log('table model loaded', object);
}, undefined, (error) => {
    console.error('table model load error', error);
});

const chairPivot = new THREE.Group();
chairPivot.name = 'chair_pivot';
chairPivot.position.set(0, 0, 0); // Pivot at floor contact height
items.push({ group: chairPivot, name: 'chair_pivot' });

const chairItem = new THREE.Group();
chairItem.name = 'chair';
chairPivot.add(chairItem);

const chairLoader = new GLTFLoader();
chairLoader.load('../models/rocking_chair.glb', (gltf) => {
    const object = gltf.scene || gltf;
    const scale = 1;  // Adjusted size
    object.scale.set(scale, scale, scale);
    object.traverse(child => {
        if (child.isMesh) child.castShadow = true;
    });

    // Align the chair model so its bottom rests on the pivot/floor plane
    const box = new THREE.Box3().setFromObject(object);
    const yOffset = box.min.y;
    const zCenter = (box.min.z + box.max.z) * 0.5;
    const xCenter = (box.min.x + box.max.x) * 0.5;
    object.position.y -= yOffset;
    object.position.z -= zCenter;
    object.position.x -= xCenter;

    chairItem.add(object);
    console.log('chair model loaded', object);
}, undefined, (error) => {
    console.error('chair model load error', error);
});

const bookItem = createItem('book');
bookItem.position.set(8.5, 5.2, 1);
const bookLoader = new GLTFLoader();
bookLoader.load('../models/old_book.glb', (gltf) => {
    const object = gltf.scene || gltf;
    const scale = 5;  // Adjusted size
    object.scale.set(scale, scale, scale);
    object.traverse(child => {
        if (child.isMesh) child.castShadow = true;
    });
    bookItem.add(object);
    console.log('book model loaded', object);
}, undefined, (error) => {
    console.error('book model load error', error);
});

const cameraItem = createItem('camera');
cameraItem.position.set(8, 5.25, -1);
cameraItem.rotation.y = 90;
const cameraLoader = new GLTFLoader();
cameraLoader.load('../models/film_camera.glb', (gltf) => {
    const object = gltf.scene || gltf;
    const scale = 0.1;  // Adjusted size
    object.scale.set(scale, scale, scale);
    object.traverse(child => {
        if (child.isMesh) child.castShadow = true;
    });
    cameraItem.add(object);
    console.log('camera model loaded', object);
}, undefined, (error) => {
    console.error('camera model load error', error);
});

const catItem = createItem('cat');
catItem.position.set(10.5, 5, -1);
catItem.rotation.y = 90;
const catLoader = new FBXLoader();
catLoader.load('../models/cat.fbx', (fbx) => {
    const object = fbx.scene || fbx;
    const scale = 0.03;  // Adjusted size
    object.scale.set(scale, scale, scale);
    object.traverse(child => {
        if (child.isMesh) child.castShadow = true;
    });
    catItem.add(object);
    console.log('cat model loaded', object);
}, undefined, (error) => {
    console.error('cat model load error', error);
});

const recordPlayerItem = createItem('record_player');
recordPlayerItem.position.set(5, 3.5, -3);
const recordPlayerLoader = new GLTFLoader();
recordPlayerLoader.load('../models/record_player.glb', (gltf) => {
    const object = gltf.scene || gltf;
    const scale = 1;  // Adjusted size
    object.scale.set(scale, scale, scale);
    object.traverse(child => {
        if (child.isMesh) child.castShadow = true;
    });
    recordPlayerItem.add(object);
    console.log('record_player model loaded', object);
}, undefined, (error) => {
    console.error('record_player model load error', error);
});

let audio;
let audioState = 0; // 0 = stopped, 1 = audio1 playing, 2 = audio2 playing
let chairRocking = false;
let chairRockingInterval;
let chairInitialRotation;

export function click(mouse, scene, camera) {
    //Raycasting to detect clicks on the model
    if (recordPlayerItem) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(recordPlayerItem, true); // check for intersection with the model and its children
        if (intersects.length > 0) {
            console.log('Record player clicked!');

            // Stop current audio if playing
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }

            // Cycle through states
            audioState = (audioState + 1) % 3; // Cycles: 0 -> 1 -> 2 -> 0

            if (audioState === 1) {
                audio = new Audio('../src/audio/record_song.mp3');
                audio.play();
                console.log('Audio 1 started');
            } else if (audioState === 2) {
                audio = new Audio('../src/audio/(what a) wonderful world.mp3'); // Change to your second audio file
                audio.play();
                console.log('Audio 2 started');
            } else {
                console.log('Audio stopped');
            }
        }
    };
    // Animate the rocking chair when clicked on z axis back and forth
    if (chairPivot) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(chairPivot, true);
        if (intersects.length > 0) {
            console.log('Chair clicked!');

            if (chairRocking) {
                // Stop the rocking animation
                clearInterval(chairRockingInterval);
                chairPivot.rotation.x = chairInitialRotation;
                chairRocking = false;
                console.log('Chair stopped rocking');
            } else {
                // Start the rocking animation
                chairInitialRotation = chairPivot.rotation.x;
                let direction = 1;
                chairRocking = true;
                chairRockingInterval = setInterval(() => {
                    chairPivot.rotation.x += direction * 0.0025; // Gentle rocking speed
                    if (chairPivot.rotation.x > chairInitialRotation + 0.1 || chairPivot.rotation.x < chairInitialRotation - 0.1) {
                        direction *= -1; // Change direction
                    }
                }, 40); // Slower timing for a shallow arc
                console.log('Chair started rocking');
            }
        }

    }

};

