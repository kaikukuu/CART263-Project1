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
shellItem.position.set(11.5, 5, 2);
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
    object.scale.set(0.15, 0.15, 0.15);
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
//add a light source to the lamp
const lampLight = new THREE.PointLight(0xffaa88, 3, 15, 2);
lampLight.position.set(0, 0.8, 0);
lampLight.castShadow = true;
vintageLamp.add(lampLight);

const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 16),
    new THREE.MeshBasicMaterial({
        color: 0xffddaa,
        emissive: 0xffaa88,
        emissiveIntensity: 2
    })
);
bulb.position.set(0, 0.8, 0);
vintageLamp.add(bulb);


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
bookItem.position.set(8, 5.2, 1);
const bookLoader = new GLTFLoader();
bookLoader.load('../models/old_book.glb', (gltf) => {
    const object = gltf.scene || gltf;
    const scale = 5.25;  // Adjusted size
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
recordPlayerItem.position.set(4.5, 3.5, -3);
const recordPlayerLoader = new GLTFLoader();
recordPlayerLoader.load('../models/record_player.glb', (gltf) => {
    const object = gltf.scene || gltf;
    const scale = 1.25;  // Adjusted size
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
const waveAudio = new Audio('../src/audio/wave_sound.wav');
const ringAudio = new Audio('../src/audio/phn_ring.mp3');
let phoneState = 0; // 0 = idle, 1 = ringing, 2 = picked up

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
            //TODO: Add a "now playing" display above the record player that shows the name of the song currently playing, and hide it when audio is stopped
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
            //TODO: Add a gentle creaking sound effect that plays in sync with the rocking motion, and stops when the chair stops rocking and display a message that says "The chair seems to be rocking on its own... as if she's still here" when the rocking starts and "The chair has stopped rocking." when it stops
        }

    };

    // Play wave sound when shell is clicked
    if (shellItem) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(shellItem, true);
        if (intersects.length > 0) {
            console.log('Shell clicked!');
            waveAudio.currentTime = 0; // Reset to start
            waveAudio.play();
            console.log('Wave sound played');
            //TODO: Add gentle shell movement when clicked and open a media box with ocean visuals and the wave sound playing in a loop until closed

        }
    }

    // Play phone ring at a random time
    if (phnItem) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(phnItem, true);
        if (intersects.length > 0) {
            console.log('Phone clicked!');

            if (phoneState === 0) {
                // First click: start ringing after random delay
                setTimeout(() => {
                    if (phoneState === 0) { // Only if not stopped
                        ringAudio.currentTime = 0;
                        ringAudio.play();
                        phoneState = 1; // Now ringing
                        console.log('Phone ring started');

                        // Auto-stop after 10 seconds
                        setTimeout(() => {
                            if (phoneState === 1) {
                                ringAudio.pause();
                                ringAudio.currentTime = 0;
                                phoneState = 0;
                                console.log('Phone ring auto-stopped');
                            }
                        }, 10000);
                    }
                }, Math.random() * 5000); // Random delay up to 5 seconds
            } else if (phoneState === 1) {
                // Second click: stop ringing and play pickup
                ringAudio.pause();
                ringAudio.currentTime = 0;
                phoneState = 2; // Picked up
                console.log('Phone ring stopped');

                // Play pickup sound
                setTimeout(() => {
                    const pickupAudio = new Audio('../src/audio/phn_pickup.mp3');
                    pickupAudio.play();
                    console.log('Phone pickup sound played');

                    // Play conversation after pickup
                    setTimeout(() => {
                        const convoAudio = new Audio('../src/audio/voicemail-sound.flac');
                        convoAudio.play();
                        console.log('Phone conversation sound played');
                        phoneState = 0; // Reset after conversation
                    }, 3000);
                }, 500);
            }
        }
    };

    // Cat meows and purrs when clicked
    if (catItem) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(catItem, true);
        if (intersects.length > 0) {
            console.log('Cat clicked!');
            const meowAudio = new Audio('../src/audio/meownpurr.mp3');
            meowAudio.play();
            console.log('Cat meow sound played');
        }
        //if the cat is clicked and held for more than 2 seconds, play a purring sound and display a message that says "The cat seems to be comforted by your touch... you feel a little less alone."
        let catClickTimer;
        raycaster.setFromCamera(mouse, camera);
        const intersectsHold = raycaster.intersectObject(catItem, true);
        if (intersectsHold.length > 0) {
            catClickTimer = setTimeout(() => {
                const purrAudio = new Audio('../src/audio/purr.mp3');
                purrAudio.play();
                console.log('Cat purr sound played');
                alert("The cat seems to be comforted by your touch... you feel a little less alone.");
            }, 2000);
        } else {
            clearTimeout(catClickTimer);
        }
    }

    // Play camera shutter sound when camera is clicked
    if (cameraItem) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(cameraItem, true);
        if (intersects.length > 0) {
            console.log('Camera clicked!');
            const shutterAudio = new Audio('../src/audio/camera_shutter.mp3');
            shutterAudio.play();
            console.log('Camera shutter sound played');
            // TODO: Add a flash of light from the camera lens when clicked and display a message that says "You feel like you've captured a memory... but something is missing."
            //Display some film photos items to the player that can be flipped through along with description text
            // The people in the photos are too faded to make out. The most recent photo shows a faint figure sitting in the chair, but it's too blurry to make out any details.
        }
    };

    // Display a message when the book is clicked and add a subtle glowing effect to the book while the message is displayed
    if (bookItem) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(bookItem, true);
        if (intersects.length > 0) {
            console.log('Book clicked!');
            // Add glowing effect
            bookItem.traverse(child => {
                if (child.isMesh) {
                    child.material.emissive = new THREE.Color(0x4444ff);
                    child.material.emissiveIntensity = 0.5;
                }
            });
            // Display message
            alert("The scrapbook is filled with old, faded photographs, keepsakes and handwritten notes. The details are too worn to decipher.");
            // Remove glowing effect after message is closed
            bookItem.traverse(child => {
                if (child.isMesh) {
                    child.material.emissive = new THREE.Color(0x000000);
                    child.material.emissiveIntensity = 0;
                }
            });

        }
    }
}
