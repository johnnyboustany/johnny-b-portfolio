import * as THREE from 'https://unpkg.com/three@0.127/build/three.module.js';
import { Sky } from 'https://unpkg.com/three@0.127/examples/jsm/objects/Sky.js';
import { Water } from 'https://unpkg.com/three@0.127/examples/jsm/objects/Water.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.127/examples/jsm/loaders/GLTFLoader.js';

// Setup

const scene = new THREE.Scene();

let innerWidth = window.innerWidth;
let innerHeight = window.innerHeight;

let camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 2000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;

camera.position.set( -3, 10, 30 );

// Setting up natural environment

let sun = new THREE.Vector3();

// Water

const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

let water = new Water(
    waterGeometry,
    {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('./static/assets/waternormals.jpg', function ( texture ) {

            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        } ),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
    }
);

water.rotation.x = - Math.PI / 2;

scene.add( water );

// Sky

const sky = new Sky();
sky.scale.setScalar( 10000 );
scene.add( sky );

const skyUniforms = sky.material.uniforms;

skyUniforms[ 'turbidity' ].value = 10;
skyUniforms[ 'rayleigh' ].value = 2;
skyUniforms[ 'mieCoefficient' ].value = 0.005;
skyUniforms[ 'mieDirectionalG' ].value = 0.7; // 0.8


// Sun
const parameters = {
    elevation: 0.8,
    azimuth: 140
};

const pmremGenerator = new THREE.PMREMGenerator( renderer );
let renderTarget;

function updateSun() {

    const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
    const theta = THREE.MathUtils.degToRad( parameters.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

    if ( renderTarget !== undefined ) renderTarget.dispose();

    renderTarget = pmremGenerator.fromScene( sky );

    scene.environment = renderTarget.texture;

}

updateSun();

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);


// Johnny Cube
const johnnyTexture = new THREE.TextureLoader().load('./static/assets/johnny.png');

const johnny = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ map: johnnyTexture }));

scene.add(johnny);

if(!isMobile()){
    johnny.position.z = -25;
    johnny.position.x = 15;
} else {
    johnny.position.z = -60;
    johnny.position.x = 14;
}


johnny.rotation.x = 20;

// Boat
let loadedBoat;
const gltfLoader = new GLTFLoader();
gltfLoader.load('./static/assets/wooden_boat/scene.gltf', (gltfScene) => {
    loadedBoat = gltfScene;
    if(!isMobile()){
        scene.add(gltfScene.scene);
        gltfScene.scene.position.z = 20;
        gltfScene.scene.scale.set(0.1, 0.1,0.1, 0.1)
        gltfScene.scene.position.setX(-40);

    }
});


// Scroll Animation

// let oldValue = 0; // for knowing when user scrolls up or down

function moveCamera() {
    const home_span = document.getElementById("home-span");

    const aboutme_span = document.getElementById("about-me-span");
    const aboutme = document.getElementById("about-me");

    const projects_span  = document.getElementById("projects-span");
    const projects = document.getElementById("projects");

    const experience_span  = document.getElementById("experience-span");
    const experience = document.getElementById("experience");

    const skills_span  = document.getElementById("skills-span");
    const skills = document.getElementById("skills");

    const contact_span  = document.getElementById("contact-span");

    if(!isMobile()){
        if (pageYOffset >= 0 < aboutme.offsetTop - 3*aboutme.clientHeight / 3) {
            home_span.classList.add("bold")
            aboutme_span.classList.remove("bold");
            projects_span.classList.remove("bold");
            experience_span.classList.remove("bold");
            skills_span.classList.remove("bold");
            contact_span.classList.remove("bold");

        }

        if (pageYOffset >= aboutme.offsetTop - 3*aboutme.clientHeight / 3 && pageYOffset < projects.offsetTop - 3*projects.clientHeight / 3) {
            aboutme_span.classList.add("bold")
            home_span.classList.remove("bold");
            projects_span.classList.remove("bold");
            experience_span.classList.remove("bold");
            skills_span.classList.remove("bold");
            contact_span.classList.remove("bold");
        }

        if (pageYOffset >= projects.offsetTop - 3*projects.clientHeight / 3 && pageYOffset <  experience.offsetTop - experience.clientHeight / 3) {
            projects_span.classList.add("bold");
            home_span.classList.remove("bold");
            aboutme_span.classList.remove("bold");
            experience_span.classList.remove("bold");
            skills_span.classList.remove("bold");
            contact_span.classList.remove("bold");
        }

        if (pageYOffset >= experience.offsetTop - experience.clientHeight / 3 && pageYOffset < skills.offsetTop - skills.clientHeight / 3) {
            experience_span.classList.add("bold");
            home_span.classList.remove("bold");
            aboutme_span.classList.remove("bold");
            projects_span.classList.remove("bold");
            skills_span.classList.remove("bold");
            contact_span.classList.remove("bold");
        }
        if (pageYOffset >= skills.offsetTop - (skills.clientHeight) / 3 && pageYOffset < (skills.offsetTop - (skills.clientHeight) / 3)+skills.clientHeight) {
            skills_span.classList.add("bold");
            home_span.classList.remove("bold");
            aboutme_span.classList.remove("bold");
            projects_span.classList.remove("bold");
            experience_span.classList.remove("bold");
            contact_span.classList.remove("bold");
        }
        if (pageYOffset >= (skills.offsetTop - (skills.clientHeight) / 3)+skills.clientHeight/1.5){
            contact_span.classList.add("bold");
            home_span.classList.remove("bold");
            aboutme_span.classList.remove("bold");
            projects_span.classList.remove("bold");
            experience_span.classList.remove("bold");
            skills_span.classList.remove("bold");
        }
    }

    const t = document.body.getBoundingClientRect().top;
    johnny.rotation.y += 0.01;
    johnny.rotation.z += 0.01;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
}

window.addEventListener("scroll", moveCamera);
moveCamera();


// Animation Loop

var requestID;


function animate() {
  requestID = requestAnimationFrame(animate);

    // Animates the water
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

    const time = performance.now() * 0.001;

    johnny.position.y = Math.sin( time ) + 0.8;

    if( !isMobile() && loadedBoat){
        loadedBoat.scene.position.y = Math.sin( time ) - 0.5;
        loadedBoat.scene.rotation.z = Math.sin( time )/20;
    }

    renderer.render(scene, camera);
}

function pause() {
  cancelAnimationFrame(requestID);
}

animate();


// Sticky
// Get the navbar
var navbar = document.getElementById("navbar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function stickyFunction() {
    if(!isMobile()){
        if ( window.pageYOffset > sticky) {
            navbar.classList.add("sticky");
            navbar.classList.add("fade-in");
        } else {
            navbar.classList.remove("sticky");
            navbar.classList.remove("fade-in");
        }
    }
}


function isMobile(){
    return window.innerWidth <= 1000;
}


window.addEventListener("scroll", stickyFunction);


// modal popup for projects
const openBtns = document.querySelectorAll('.open');

openBtns.forEach(function(btn){
  const modal = btn.getAttribute('data-modal');
  btn.addEventListener('click',()=>{
      const body = document.querySelector("body");
      body.style.overflowY = "hidden";
      document.getElementById(modal).classList.add('show');
      pause();
  });
})

const closeBtns = document.querySelectorAll('.close');

closeBtns.forEach(function(btn){
  const modal = btn.getAttribute('data-modal');
  btn.addEventListener('click',()=>{
      const body = document.querySelector("body");
      body.style.overflowY = "auto";

      document.getElementById(modal).classList.remove('show');
      animate();
  });
})

// controlling scroll navigation
const home = document.getElementById('home-a');
  home.addEventListener('click',()=>{
  johnny.rotation.x = 20;
  johnny.rotation.y = 0;
  johnny.rotation.z = 0;
  window.focus();
  window.scrollTo(0,0);

});

const aboutme = document.getElementById('aboutme-a');
aboutme.addEventListener('click',()=>{
    window.focus();
    window.scrollTo(0, window.innerHeight - 5*aboutme.clientHeight );
});

const projects = document.getElementById('projects-a');
projects.addEventListener('click',()=>{

    window.focus();
    window.scrollTo(0, 2.2*(window.innerHeight - 5*projects.clientHeight) );

});

window.addEventListener('resize',function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if(!isMobile()){
        johnny.position.z = -25;
        johnny.position.x = 15;
    } else {
        johnny.position.z = -60;
        johnny.position.x = 14;
    }
});

const email = document.getElementById('email');

email.addEventListener('click',()=>{
    var tooltip = document.getElementById("myTooltip");

    copy("johnny_boustany@brown.edu");
    // Copy the text inside the text field
    navigator.clipboard.writeText("johnny_boustany@brown.edu");


    tooltip.innerHTML = "copied email.";
});

email.addEventListener('mouseleave',()=>{

    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "copy to clipboard.";
});

function copy(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}


