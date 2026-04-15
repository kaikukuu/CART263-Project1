import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { Sun } from './Sun.js';
// import { PlanetA } from './TeamA.js';
// import { PlanetB } from './TeamB.js';
// import { PlanetC } from './TeamC.js';
// import { PlanetD } from './TeamD.js';
// import { PlanetE } from './TeamE.js';
// import { PlanetF } from './TeamF.js';
import { items } from './js/items.js';
import { click } from './js/items.js';

// --- Core Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510); // Deep space

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 60);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(9.5, 0.5, 2); // Focus on the center of the floor plane with models
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
const floorGeometry = new THREE.PlaneGeometry(50, 50);
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

const gridHelper = new THREE.GridHelper(120, 24, 0x444444, 0x222222);
gridHelper.position.y = -0.1;
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(30);
scene.add(axesHelper);

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

    // Update sun
    // sun.update(timer);

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

    // Update all planets (this handles planet orbit, moon orbits, and critter animations)
    //  planets.forEach(planet => planet.update(delta));

    controls.update();
    renderer.render(scene, camera);
}

animate(0);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Click handler
const mouse = new THREE.Vector2();
renderer.domElement.addEventListener('click', (event) => {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    click(mouse, scene, camera);
});