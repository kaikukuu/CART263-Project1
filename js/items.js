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
shellItem.position.set(7.5, 5, 2);
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
phnItem.position.set(6, 5.2, 1);
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
vintageLamp.position.set(5, 4.75, -1);
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
// Add a stronger light source to the lamp
const lampLight = new THREE.PointLight(0xffaa88, 6, 25, 2);
lampLight.position.set(-0.5, 1.2, 0);
lampLight.castShadow = true;
lampLight.shadow.mapSize.width = 1024;
lampLight.shadow.mapSize.height = 1024;
lampLight.shadow.bias = -0.0005;
vintageLamp.add(lampLight);

const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 16, 16),
    new THREE.MeshStandardMaterial({
        color: 0xffddaa,
        emissive: 0xffaa88,
        emissiveIntensity: 4,
        roughness: 0.2,
        metalness: 0.1
    })
);
bulb.position.set(-0.5, 2, 0);
vintageLamp.add(bulb);

// Add glow halo around the bulb for a larger visible light area
const bulbGlow = new THREE.Mesh(
    new THREE.SphereGeometry(1, 16, 16),
    new THREE.MeshBasicMaterial({
        color: 0xffd8b0,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
bulbGlow.position.copy(bulb.position);
vintageLamp.add(bulbGlow);

const tableItem = createItem('table');
tableItem.position.set(6, 2.5, 0);
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
    //allow the table to receive shadows 
    tableItem.traverse(child => {
        if (child.isMesh) {
            child.receiveShadow = true;
        }
    });
}, undefined, (error) => {
    console.error('table model load error', error);
});

const chairPivot = new THREE.Group();
chairPivot.name = 'chair_pivot';
chairPivot.position.set(-5, 0, 0); // Pivot at floor contact height
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

    // Center the model on x/z and lift it so its lowest point sits at y=0,
    // ensuring the chair rocks around the pivot at floor level.
    const box = new THREE.Box3().setFromObject(object);
    const yOffset = box.min.y;
    const zCenter = (box.min.z + box.max.z) * 0.5;
    const xCenter = (box.min.x + box.max.x) * 0.5;
    object.position.y -= yOffset;
    object.position.z -= zCenter;
    object.position.x -= xCenter;

    chairItem.add(object);
    console.log('chair model loaded', object);
    //allow the chair to receive shadows 
    chairItem.traverse(child => {
        if (child.isMesh) {
            child.receiveShadow = true;
        }
    });
}, undefined, (error) => {
    console.error('chair model load error', error);
});

const bookItem = createItem('book');
bookItem.position.set(4, 5.2, 1);
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
cameraItem.position.set(4, 5.25, -1);
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
catItem.position.set(7.5, 5, -1);
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
recordPlayerItem.position.set(0, 3.5, -3);
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

// --- Audio & State ---
let audio;                // Currently playing record player audio
let audioState = 0; // 0 = stopped, 1 = audio1 playing, 2 = audio2 playing, 3 = audio3 playing
let chairRocking = false;
let chairRockingInterval;   // setInterval handle for the rocking animation loop
let chairInitialRotation;   // Stores the chair's x-rotation at rest so it resets cleanly
const waveAudio = new Audio('./src/audio/wave_sound.wav');
const lightSwitchAudio = new Audio('./src/audio/light_switch.mp3');
const ringAudio = new Audio('./src/audio/phn_ring.mp3');
ringAudio.loop = true;

// Phone state machine:
//   0 = idle          — phone is not in use
//   1 = waiting       — first click registered; ring will start after phoneRingDelayMs
//   2 = ringing       — ring audio is playing; second click answers the call
//   3 = conversation  — voicemail audio is playing
let phoneState = 0;
let phoneRingDelayTimer = null;       // Delays the ring start after first click
let phoneRingAutoStopTimer = null;    // Auto-cancels the ring if never answered
let phoneConversationAudio = null;
let phoneConversationStartTimer = null; // Short gap between pickup sound and voicemail
let playPickupAfterConversation = false; // Queues a pickup click-sound at conversation end
let pickupAudio = null;
const phoneRingDelayMs = 5000;        // ms before ring starts after first click
const phoneRingAutoStopMs = 30000;    // ms before unanswered ring gives up
const incomingCallDelayMs = 5000;     // ms after ring starts before the banner appears
let incomingCallTimer = null;
let cameraPhotoIndex = 0;  // Cycles through cameraPhotos array on each click
let lampIsOn = true;
const pageFlipAudio = new Audio('./src/audio/page-flip.mp3');

const cameraPhotos = [
    'src/photos/p1.png',
    'src/photos/p2.png',
    'src/photos/p3.png',
    'src/photos/p4.jpg',
    'src/photos/p5.png'
];

// Track names for now playing display
const trackNames = [
    'No track selected',
    'What a Wonderful World',
    '(What a) Wonderful World',
    'I Only Have Eyes For You'
];

function updateNowPlaying() {
    const box = document.getElementById('now-playing-box');
    const trackText = document.querySelector('.now-playing-track');
    if (!box || !trackText) return;

    if (audioState === 0) {
        box.style.display = 'none';
    } else {
        box.style.display = 'flex';
        trackText.textContent = trackNames[audioState] || 'Unknown Track';
    }
}

function setIncomingCallVisible(visible) {
    const incomingCallBox = document.getElementById('incoming-call-box');
    if (!incomingCallBox) return;

    incomingCallBox.style.display = visible ? 'block' : 'none';
    incomingCallBox.setAttribute('aria-hidden', visible ? 'false' : 'true');
}

function playPageFlip() {
    pageFlipAudio.pause();
    pageFlipAudio.currentTime = 0;
    pageFlipAudio.play().catch((error) => {
        console.warn('Page flip audio failed to play:', error);
    });
}

function showOpenBookOverlay() {
    const openBookBox = document.getElementById('openbook-box');
    const openBookIcon = document.getElementById('openbook-icon');
    if (!openBookBox) return;
    if (!openBookIcon) return;

    const pages = [
        'src/icons/p1p.png',
        'src/icons/p2p.png',
        'src/icons/p3p.png'
    ];
    let currentPageIndex = 0;

    openBookIcon.src = pages[currentPageIndex];
    openBookIcon.style.display = 'block';
    openBookBox.style.display = 'flex';
    openBookBox.setAttribute('aria-hidden', 'false');
    playPageFlip();

    // Each click advances one page; on the final page the overlay closes itself
    // and removes its own listener so it doesn't fire on the next book open.
    const closeOverlay = () => {
        playPageFlip();
        currentPageIndex += 1;

        if (currentPageIndex < pages.length) {
            openBookIcon.src = pages[currentPageIndex];
            return;
        }

        openBookIcon.style.display = 'none';
        openBookIcon.src = pages[0];
        openBookBox.style.display = 'none';
        openBookBox.setAttribute('aria-hidden', 'true');
        openBookBox.removeEventListener('click', closeOverlay);
    };

    openBookBox.addEventListener('click', closeOverlay);
}

function showCameraPhotoOverlay() {
    const photoBox = document.getElementById('camera-photo-box');
    const photoImage = document.getElementById('camera-photo-image');
    if (!photoBox || !photoImage || cameraPhotos.length === 0) return;

    photoImage.src = cameraPhotos[cameraPhotoIndex];
    photoBox.style.display = 'flex';
    photoBox.setAttribute('aria-hidden', 'false');

    cameraPhotoIndex = (cameraPhotoIndex + 1) % cameraPhotos.length;

    photoBox.onclick = () => {
        photoBox.style.display = 'none';
        photoBox.setAttribute('aria-hidden', 'true');
    };
}

function showConchVideoOverlay() {
    const videoBox = document.getElementById('conch-video-box');
    const conchVideo = document.getElementById('conch-video');
    if (!videoBox || !conchVideo) return;

    videoBox.style.display = 'flex';
    videoBox.setAttribute('aria-hidden', 'false');
    conchVideo.currentTime = 0;
    conchVideo.play().catch((error) => {
        console.warn('Conch video failed to play:', error);
    });

    videoBox.onclick = () => {
        conchVideo.pause();
        videoBox.style.display = 'none';
        videoBox.setAttribute('aria-hidden', 'true');
        window.alert("Don't forget I'll always watch over you my dear, even once you've forgotten my face. Listen to the sound of the sea whenever you miss me, and know that I'm there.");
        waveAudio.pause();
        waveAudio.currentTime = 0;
        waveAudio.loop = false;
    };
}

// Plays the handset pickup click exactly once, then force-stops it after 1 s
// so a slow-loading audio file can't bleed into the conversation.
function playPickupOnce(reason = 'pickup') {
    if (pickupAudio) {
        pickupAudio.pause();
        pickupAudio.currentTime = 0;
    }

    pickupAudio = new Audio('./src/audio/phn_pickup.mp3');
    pickupAudio.loop = false;
    pickupAudio.volume = 1;
    const promise = pickupAudio.play();

    if (promise !== undefined) {
        promise
            .then(() => console.log(`Pickup audio started (${reason})`))
            .catch((error) => {
                console.warn('Pickup audio failed to play:', error);
            });
    } else {
        console.log(`Pickup audio requested (${reason})`);
    }

    pickupAudio.addEventListener('ended', () => {
        console.log('Pickup audio ended');
    });

    setTimeout(() => {
        if (pickupAudio && !pickupAudio.paused) {
            pickupAudio.pause();
            pickupAudio.currentTime = 0;
            console.log('Pickup audio stopped after 1 second');
        }
    }, 1000);
}

// Centralized cleanup: stops all phone audio and clears every timer.
// Always call this before changing phoneState to avoid lingering timers.
function stopRing() {
    if (!ringAudio.paused) {
        ringAudio.pause();
        ringAudio.currentTime = 0;
    }
    if (phoneRingDelayTimer) {
        clearTimeout(phoneRingDelayTimer);
        phoneRingDelayTimer = null;
    }
    setIncomingCallVisible(false);
    if (incomingCallTimer) {
        clearTimeout(incomingCallTimer);
        incomingCallTimer = null;
    }
    if (phoneRingAutoStopTimer) {
        clearTimeout(phoneRingAutoStopTimer);
        phoneRingAutoStopTimer = null;
    }
    if (phoneConversationStartTimer) {
        clearTimeout(phoneConversationStartTimer);
        phoneConversationStartTimer = null;
    }
}

// Starts the ring audio and installs two timers:
//   incomingCallTimer     — shows the "Incoming Call" banner after a short delay
//   phoneRingAutoStopTimer — gives up and resets if the call is never answered
function startPhoneRing() {
    stopRing();
    ringAudio.currentTime = 0;
    ringAudio.play().catch((error) => {
        console.warn('Ring audio failed to play:', error);
    });
    phoneState = 2;
    console.log('Phone ring started');

    incomingCallTimer = setTimeout(() => {
        if (phoneState === 2) {
            setIncomingCallVisible(true);
        }
    }, incomingCallDelayMs);

    phoneRingAutoStopTimer = setTimeout(() => {
        if (phoneState === 2) {
            stopRing();
            phoneState = 0;
            console.log('Phone ring auto-stopped');
        }
    }, phoneRingAutoStopMs);
}

function handleConversationEnded() {
    if (playPickupAfterConversation) {
        playPickupAfterConversation = false;
        console.log('Playing pickup audio after conversation ended');
        playPickupOnce('after-conversation');
    }
    stopRing();
    phoneState = 0;
    phoneConversationAudio = null;
    console.log('Phone conversation ended');
}

function startConversation() {
    if (phoneConversationAudio) {
        phoneConversationAudio.pause();
        phoneConversationAudio.currentTime = 0;
        phoneConversationAudio.removeEventListener('ended', handleConversationEnded);
        phoneConversationAudio.onended = null;
    }

    phoneConversationAudio = new Audio('./src/audio/voicemail-sound.flac');
    phoneConversationAudio.loop = false;
    phoneState = 3; // conversation playing
    phoneConversationAudio.addEventListener('ended', handleConversationEnded);
    phoneConversationAudio.onerror = (event) => {
        console.warn('Conversation audio error:', event);
        handleConversationEnded();
    };
    const promise = phoneConversationAudio.play();
    if (promise !== undefined) {
        promise
            .then(() => console.log('Phone conversation sound started'))
            .catch((error) => {
                console.warn('Conversation audio failed to play:', error);
                handleConversationEnded();
            });
    } else {
        console.log('Phone conversation sound requested');
    }
}

// Main click handler called by universe.js on every canvas click.
// Each item gets its own Raycaster check; the first item whose bounding
// volume is hit handles the click (there is intentionally no early exit
// so multiple overlapping items could theoretically both respond).
export function click(mouse, scene, camera) {
    if (recordPlayerItem) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        // intersectObject with recursive=true checks the model and all child meshes
        const intersects = raycaster.intersectObject(recordPlayerItem, true);
        if (intersects.length > 0) {
            console.log('Record player clicked!');

            // Stop current audio if playing
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }

            // Cycle through states
            audioState = (audioState + 1) % 4; // Cycles: 0 -> 1 -> 2 -> 3 -> 0

            if (audioState === 1) {
                audio = new Audio('./src/audio/record_song.mp3');
                audio.play();
                console.log('Audio 1 started');
            } else if (audioState === 2) {
                audio = new Audio('./src/audio/(what a) wonderful world.mp3'); // Change to your second audio file
                audio.play();
                console.log('Audio 2 started');
            } else if (audioState === 3) {
                audio = new Audio('./src/audio/I Only Have Eyes For You.mp3'); // Change to your fourth audio file
                audio.play();
                console.log('Audio 3 started');
            } else {
                console.log('Audio stopped');
            }
            updateNowPlaying();

        }
    };

    // Toggle lamp with switch sound when lamp is clicked
    if (vintageLamp) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(vintageLamp, true);
        if (intersects.length > 0) {
            console.log('Lamp clicked!');
            lightSwitchAudio.currentTime = 0;
            lightSwitchAudio.play().catch((error) => {
                console.warn('Light switch audio failed to play:', error);
            });

            lampIsOn = !lampIsOn;
            bulb.visible = lampIsOn;
            bulbGlow.visible = lampIsOn;
            lampLight.visible = lampIsOn;
            console.log(lampIsOn ? 'Lamp turned on' : 'Lamp turned off and bulb hidden');
        }
    }

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
                window.alert("Grandma's chair... There's no one here... Let's not thinking about it too much, maybe if you rock the chair, you'll feel a little less alone.");
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

    };

    // Play wave sound when shell is clicked
    if (shellItem) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(shellItem, true);
        if (intersects.length > 0) {
            console.log('Shell clicked!');
            const wantsToListen = window.confirm('Do you want to listen to the sound of the sea?');
            if (wantsToListen) {
                waveAudio.loop = true;
                waveAudio.currentTime = 0; // Reset to start
                waveAudio.play();
                showConchVideoOverlay();
                console.log('Wave sound played');
            } else {
                console.log('Player declined conch audio');
            }
        }
    }

    // Click once to schedule the phone ring, click again while ringing to answer, and queue the final pickup during conversation.
    if (phnItem) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(phnItem, true);
        if (intersects.length > 0) {
            console.log('Phone clicked!');

            if (phoneState === 0) {
                // First click: schedule ringing after a delay.
                playPickupAfterConversation = false;
                stopRing();
                phoneState = 1;
                phoneRingDelayTimer = setTimeout(() => {
                    if (phoneState === 1) {
                        startPhoneRing();
                    }
                }, phoneRingDelayMs);
                console.log('Phone ring scheduled');
            } else if (phoneState === 1) {
                // Second click before ringing starts: cancel pending ring.
                stopRing();
                phoneState = 0;
                playPickupAfterConversation = false;
                console.log('Phone ring canceled before it started');
            } else if (phoneState === 2) {
                // Second click while ringing: stop ring and start pickup + conversation
                stopRing();
                phoneState = 3;
                playPickupAfterConversation = true;
                console.log('Phone picked up while ringing');

                playPickupOnce('before-conversation');
                phoneConversationStartTimer = setTimeout(() => {
                    startConversation();
                }, 1000);
            } else if (phoneState === 3) {
                // Conversation is already playing; queue pickup at the end
                if (!playPickupAfterConversation) {
                    playPickupAfterConversation = true;
                    console.log('Pickup queued after conversation');
                }
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
            const meowAudio = new Audio('./src/audio/meownpurr.mp3');
            meowAudio.play();
            console.log('Cat meow sound played');
        }
        //if the cat is clicked and held for more than 2 seconds, play a purring sound and display a message that says "The cat seems to be comforted by your touch... you feel a little less alone."
        let catClickTimer;
        raycaster.setFromCamera(mouse, camera);
        const intersectsHold = raycaster.intersectObject(catItem, true);
        if (intersectsHold.length > 0) {
            catClickTimer = setTimeout(() => {
                const purrAudio = new Audio('./src/audio/purr.mp3');
                purrAudio.play();
                console.log('Cat purr sound played');
                alert("Savu the cat seems to be comforted by your touch... you feel a little less alone."); //Savu means "smoke" in Finnish
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
            const shutterAudio = new Audio('./src/audio/camera_shutter.mp3');
            shutterAudio.play();
            console.log('Camera shutter sound played');
            showCameraPhotoOverlay();
            window.alert("Everyday moments can be precious memories. Even if you can't remember them all, you can always capture a glimpse of them through the lens.");
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
            showOpenBookOverlay();

            // Fade glow shortly after opening the overlay.
            setTimeout(() => {
                bookItem.traverse(child => {
                    if (child.isMesh) {
                        child.material.emissive = new THREE.Color(0x000000);
                        child.material.emissiveIntensity = 0;
                    }
                });
            }, 300);

        }
    }
}
