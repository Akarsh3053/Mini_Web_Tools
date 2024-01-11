// Define countdown time in minutes and seconds
const countdownTime = {
  minutes: 5,
  seconds: 0
};

// Initialize variables for 3D scene parameters
let initialFogDensity = 0.003;
let initialCameraZ = 100;
let initialWallWidth = 10;

// Start time for the countdown, initially null
let startTime = null;

// Start the countdown and update UI elements accordingly
function startCountdown() {
  
  // Convert countdown time to total seconds
  let totalSeconds = countdownTime.minutes * 60 + countdownTime.seconds;
    
  // Select the ring progress element and get its initial stroke offset
  const ringProgress = document.querySelector('.ring-progress');
  const initialRingOffset = parseFloat(getComputedStyle(ringProgress).getPropertyValue('stroke-dasharray'));

  // Mark the current time as the start time
  startTime = Date.now();

  // Set an interval to update the countdown every 5 milliseconds
  const countdownInterval = setInterval(() => {
    
    // Calculate elapsed, remaining time, and update UI elements
    const elapsedMilliseconds = Date.now() - startTime;
    const remainingSeconds = totalSeconds - elapsedMilliseconds / 1000;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = Math.floor(remainingSeconds % 60);
    const milliseconds = elapsedMilliseconds % 1000;

    document.getElementById('minutes').innerText = minutes > 0 ? minutes.toString().padStart(2, '0') : "00";
    document.getElementById('seconds').innerText = seconds > 0 ? seconds.toString().padStart(2, '0') : "00";

    // Update the ring progress element
    const progressPercentage = (remainingSeconds / totalSeconds) * 100;
    const ringOffset = (100 - progressPercentage) / 100 * initialRingOffset;
    ringProgress.style.strokeDashoffset = ringOffset;

    // Stop the interval when countdown reaches zero
    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
      document.getElementById('minutes').innerText = "00";
      document.getElementById('seconds').innerText = "00";
      ringProgress.style.strokeDashoffset = initialRingOffset;
    }
  }, 5);
}

// Start the countdown when the window loads
window.onload = startCountdown;

// Import necessary modules from THREE.js for 3D rendering
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { RGBELoader  } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/AfterimagePass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/ShaderPass.js';
import { FBXLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/FBXLoader.js';

let composer;

let mixer;

// Setup the renderer with default background color and device aspect ratio
var renderer = new THREE.WebGLRenderer({ canvas : document.getElementById('canvas'), antialias:true});
renderer.setClearColor(0x11151c);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const clock = new THREE.Clock();

var scene = new THREE.Scene();

// Add gradient HDR for light and color
const hdrEquirect = new RGBELoader()
  .setPath( 'https://miroleon.github.io/daily-assets/' )
  .load( 'gradient.hdr', function () {

  hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
} );

// Add gradient HDR to scene environment
scene.environment = hdrEquirect;

// Add fog. Check top of the code for initalFogDensity. Adapt as desired
scene.fog = new THREE.FogExp2(0x11151c, initialFogDensity);

// Set a camera amd position
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = initialCameraZ;
camera.position.y = 50;

// Material setup
// Add a relatively light color to the wall and set the envMap and envMapIntensity to ensure that the HDR has an effect
var wall_mat = new THREE.MeshPhysicalMaterial({
  color: 0xff7700,
  envMap: hdrEquirect,
  envMapIntensity: 0.5
});

// Set color and emissiveness to black so that the human does NOT react to the HDR
var human_mat = new THREE.MeshStandardMaterial({
color: 0x000000,
emissve: 0x000000
});

// Set FBXLoader to load the 3D assets
const loader = new FBXLoader();
loader.load( 'https://miroleon.github.io/daily-assets/human_walk_04.fbx', function ( object ) {

// Add mixer for animation
mixer = new THREE.AnimationMixer( object );
const action = mixer.clipAction( object.animations[ 0 ] );
action.play();

object.traverse( function ( child ) {
  if ( child.isMesh ) {
    child.castShadow = true;
    child.receiveShadow = true;
    child.material = human_mat;
}

object.position.set( 0, 1.5, -100);
object.scale.setScalar( 0.05 );
object.rotation.y = 0;

} );

scene.add( object );

} );

// Create a simple plane to use as the wall and set position
const wall_geo = new THREE.PlaneGeometry(initialWallWidth,100,10,100);
const wall = new THREE.Mesh (wall_geo, wall_mat);
scene.add(wall);
wall.position.set (0,50,-110);

// POST PROCESSING
// Add RenderPass to use post processing
const renderScene = new RenderPass( scene, camera );

// Add AfterImage for a blurry move transition
const afterimagePass = new AfterimagePass();
afterimagePass.uniforms[ 'damp' ].value = 0.9;

// Add bloom parameters and bloom to add more glow to the objects to highlight the HDR reflections
const bloomparams = {
  exposure: 1,
  bloomStrength: 1.5,
  bloomThreshold: 0.1,
  bloomRadius: 1
};

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = bloomparams.bloomThreshold;
bloomPass.strength = bloomparams.bloomStrength;
bloomPass.radius = bloomparams.bloomRadius;

// Add all to the composer to send the post processing to the renderer
composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( afterimagePass );
composer.addPass( bloomPass );

// RESIZE
window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

// Define easing function for smooth transitions
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Update function to handle 3D scene updates based on countdown
function update() {
  const delta = clock.getDelta();
  
  if (startTime) {
    // Calculate remaining time
    const totalSeconds = countdownTime.minutes * 60 + countdownTime.seconds;
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const remainingSeconds = totalSeconds - elapsedSeconds;

    if (remainingSeconds > 0) {
      const progress = elapsedSeconds / totalSeconds;
      const easedProgress = easeOutCubic(progress);

      camera.position.z = initialCameraZ - (0.5 * easedProgress) * (initialCameraZ - 50);

      scene.fog.density = initialFogDensity - (2 * easedProgress) * initialFogDensity;
    
      wall.scale.x = 1 + (25 * easedProgress);
    }
  }

  // Update mixer
  if (mixer) mixer.update(delta/1.5);
}

// Animation loop to render the 3D scene
function animate() {
  update();
  composer.render();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);