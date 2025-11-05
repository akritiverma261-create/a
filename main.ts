controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
	
})
// 3D Battle Royale Prototype (Web-based with Three.js)
// Basic setup: Player movement, camera follow, and shooting
// Run this in an HTML file with Three.js included

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, player, bullets = [], keys = {};

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // sky blue

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);

    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.y = 1;
    scene.add(player);

    window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
    window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

    window.addEventListener('click', shoot);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function shoot() {
    const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.copy(player.position);
    bullet.direction = new THREE.Vector3(0, 0, -1).applyQuaternion(player.quaternion);
    scene.add(bullet);
    bullets.push(bullet);
}

function updatePlayer() {
    const speed = 0.1;
    if (keys['w']) player.position.z -= speed;
    if (keys['s']) player.position.z += speed;
    if (keys['a']) player.position.x -= speed;
    if (keys['d']) player.position.x += speed;
    camera.position.lerp(new THREE.Vector3(player.position.x, player.position.y + 5, player.position.z + 10), 0.1);
    camera.lookAt(player.position);
}

function updateBullets() {
    bullets.forEach((b, i) => {
        b.position.addScaledVector(b.direction, 1);
        if (b.position.length() > 200) {
            scene.remove(b);
            bullets.splice(i, 1);
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    updatePlayer();
    updateBullets();
    renderer.render(scene, camera);
}
