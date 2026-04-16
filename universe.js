import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { items } from './js/items.js';
import { click } from './js/items.js';

// --- Core Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510); // Deep space

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 40, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
setRendererSize();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

function setRendererSize() {
    const aspectRatio = 16 / 9;
    let width, height;
    if (window.innerWidth / window.innerHeight > aspectRatio) {
        // Window is wider, fit height
        height = window.innerHeight;
        width = height * aspectRatio;
    } else {
        // Window is taller, fit width
        width = window.innerWidth;
        height = width / aspectRatio;
    }
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.left = left + 'px';
    renderer.domElement.style.top = top + 'px';
    document.documentElement.style.setProperty('--scene-left', left + 'px');
    document.documentElement.style.setProperty('--scene-top', top + 'px');
    document.documentElement.style.setProperty('--scene-width', width + 'px');
    document.documentElement.style.setProperty('--scene-height', height + 'px');
}

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0); // Focus on the center of the scene
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 150;
controls.minDistance = 20;
controls.autoRotate = false;
controls.update(); // Apply the new target

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Soft ambient fill light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(20, 40, 30);
directionalLight.castShadow = true;
scene.add(directionalLight);

const keyLight = new THREE.PointLight(0xffffff, 0.6);
keyLight.position.set(-20, 30, 20);
scene.add(keyLight);

// Create a floating floor
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    metalness: 0.3,
    roughness: 0.7
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
floor.position.y = 0.5; // Position at ground level
floor.receiveShadow = true;
scene.add(floor);

// Add some distant stars (background)
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 3000;
const starsPositions = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i += 3) {
    const r = 150 + Math.random() * 100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;

    starsPositions[i] = Math.sin(theta) * Math.cos(phi) * r;
    starsPositions[i + 1] = Math.sin(theta) * Math.sin(phi) * r;
    starsPositions[i + 2] = Math.cos(theta) * r;
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Add shooting stars
const shootingStars = [];

function createShootingStar() {
    // Random start position in the sky
    const startAngle = Math.random() * Math.PI * 2;
    const startHeight = Math.random() * 100 + 50;
    const distance = 200;

    const startX = Math.cos(startAngle) * distance;
    const startY = startHeight;
    const startZ = Math.sin(startAngle) * distance;

    // End position (roughly in the direction of the scene center)
    const endX = startX * 0.5;
    const endY = startHeight - 50;
    const endZ = startZ * 0.5;

    // Create the trail line
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array([
        startX, startY, startZ,
        endX, endY, endZ
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create unique material for this shooting star
    const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    shootingStars.push({
        line: line,
        startX, startY, startZ,
        endX, endY, endZ,
        progress: 0,
        speed: 0.02 + Math.random() * 0.03
    });
}

// Create initial shooting stars and schedule new ones
setInterval(() => {
    if (shootingStars.length < 5) {
        createShootingStar();
    }
}, 2000);

//create the items and add them to the scene
items.forEach(item => {
    scene.add(item.group);
});

let elapsedTime = 0;
function animate(timer) {
    requestAnimationFrame(animate);

    const delta = 0.001 * (timer - elapsedTime);
    //console.log(delta)
    elapsedTime = timer;

    // Rotate stars slowly
    stars.rotation.y += 0.1 * delta;

    // Update shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.progress += star.speed;

        if (star.progress >= 1) {
            // Remove star when animation is complete
            scene.remove(star.line);
            shootingStars.splice(i, 1);
        } else {
            // Update position along the path
            const x = star.startX + (star.endX - star.startX) * star.progress;
            const y = star.startY + (star.endY - star.startY) * star.progress;
            const z = star.startZ + (star.endZ - star.startZ) * star.progress;

            // Update line position
            const positions = star.line.geometry.attributes.position.array;
            positions[0] = star.startX;
            positions[1] = star.startY;
            positions[2] = star.startZ;
            positions[3] = x;
            positions[4] = y;
            positions[5] = z;
            star.line.geometry.attributes.position.needsUpdate = true;

            // Fade out as star reaches the end
            star.line.material.opacity = 1 - star.progress;
        }
    }
    controls.update();
    renderer.render(scene, camera);
}

animate(0);

// Handle window resize
window.addEventListener('resize', () => {
    setRendererSize();
});

// Click handler
const mouse = new THREE.Vector2();
renderer.domElement.addEventListener('click', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    // Calculate mouse position in normalized device coordinates relative to canvas
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    click(mouse, scene, camera);
});