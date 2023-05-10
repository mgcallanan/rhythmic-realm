/**
 * App.js
 *
 * The main entry point, appends Three to the DOM
 * and starts a render and animation loop
 *
 */

import Renderer from './Renderer/EffectRenderer';
import { Scene, PerspectiveCamera, Vector3 } from 'three';
import * as THREE from 'three'; // used for Orbit Controls
import SeedScene from './objects/SeedScene.js';
import { ShaderPass, RenderPass } from './Renderer/EffectRenderer';
import { FXAAShader } from './Shaders/fxaa/fxaa';
import { flowersAudioAnalysis } from '../data/spotify_data';

// React  Imports
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './stores/store';
import Main from './components/Main.jsx';
import Callback from './components/Callback.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Styles
import './styles.css';

let SECTION_INDEX = 0;
let SECTIONS = flowersAudioAnalysis.sections;
let LERPING = false;
let START_LERP_TIMESTAMP = 0;
let LERP_LENGTH = 10000;

let CURRENT_COLOR = new THREE.Color(0x212121);
let NEW_COLOR = new THREE.Color();
// Set up scene
const scene = new Scene();
scene.background = CURRENT_COLOR;

const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
const renderer = new Renderer({ antialias: false }, scene, camera);

let currFetchTimeStamp = 0;
let currSongProgress = 0;

// Post processing
const rPass = new RenderPass(scene, camera);
const FXAA = new ShaderPass(FXAAShader);
renderer.addPass(rPass);
FXAA.uniforms.resolution.value.set(
  window.innerWidth * 2,
  window.innerHeight * 2
);
FXAA.renderToScreen = true;
renderer.addPass(FXAA);

// Update FXAA on resize from Redux
store.subscribe(() => {
  const { width, height, resolution } = store.getState().Renderer;
  const { fetchTimeStamp, songProgress, currentAudioAnalysis } =
    store.getState().App;
  // set camera
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  // update the FXAA pass
  renderer.passes[1].uniforms.resolution.value.set(
    width * resolution,
    height * resolution
  );

  currFetchTimeStamp = fetchTimeStamp;
  currSongProgress = songProgress;
  SECTIONS = currentAudioAnalysis.sections;
  for (let i = 0; i < SECTIONS.length - 1; i++) {
    const currSongSec = currSongProgress * 1000;
    if (currSongSec >= SECTIONS[i] && currSongSec <= SECTIONS[i + 1]) {
      SECTIONS_INDEX = i + 1;
    }
  }
});

// Camera, Controls and Scene
const OrbitControls = require('three-orbit-controls')(THREE); // yuk
const seedScene = new SeedScene();

new OrbitControls(camera, renderer.domElement);
// scene.add(seedScene);
scene.add(seedScene);

camera.position.set(-2, 2, 10);
camera.lookAt(new Vector3(0, 0, 0));

// DOM
const reactDiv = document.createElement('div');
document.body.style.margin = 0;
document.body.style.overflow = 'hidden';
document.body.appendChild(reactDiv);
document.body.appendChild(renderer.domElement);

// Basic CSS Import
const CSSURL =
  '//cdn.rawgit.com/milligram/milligram/master/dist/milligram.min.css';
const style = document.createElement('link');
style.setAttribute('href', CSSURL);
style.setAttribute('rel', 'stylesheet');
document.body.appendChild(style);

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
  //lerp background color on section change
  // let newColor = new THREE.Color();
  // let currentColor = new THREE.Color();
  const currentSongTime = currSongProgress + (timeStamp - currFetchTimeStamp);
  if (SECTION_INDEX < SECTIONS.length - 1) {
    const nextStart = SECTIONS[SECTION_INDEX + 1].start * 1000;
    // console.log(SECTION_INDEX, SECTIONS, timeStamp % nextStart);

    if (currentSongTime % nextStart < 20) {
      LERPING = true;
      SECTION_INDEX += 1;
      NEW_COLOR.setHex(Math.random() * 0xffffff);

      CURRENT_COLOR.copy(scene.background);

      // from here: https://jsfiddle.net/prisoner849/1k397beg/

      START_LERP_TIMESTAMP = timeStamp;
    }
  }

  if (LERPING) {
    let timeSinceLerp = timeStamp - START_LERP_TIMESTAMP;
    let progress = timeSinceLerp / LERP_LENGTH;
    scene.background.copy(CURRENT_COLOR).lerp(NEW_COLOR, progress);
    if (progress >= 1.0) {
      LERPING = false;
      scene.background.copy(NEW_COLOR);
    }
  }
  // controls.update();
  // renderer.render(scene, camera);
  seedScene.update(timeStamp);
  // scene.update(timeStamp);
  window.requestAnimationFrame(onAnimationFrameHandler);

  // var startColor = new THREE.Color(0xff0000);
  // startColor.setHex(Math.random() * 0xffffff);
  // var endColor = new THREE.Color(0x00ff00);
  // endColor.setHex(Math.random() * 0xffffff);

  // let s = Math.sin(timeStamp * 2.0) * 0.5 + 0.5;
  // cube.material.color.copy(startColor).lerpHSL(endColor, s);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Renderer Go!
//Background Color, Original: 0x7ec0ee
// renderer.renderer.setClearColor(0x212121, 1);
renderer.start();

// React
render(
  <Provider store={store}>
    <BrowserRouter basename={process.env.path}>
      <Routes>
        {/* For use during deployment */}
        <Route path='/rhythmic-realm/' element={<Main/>} />
        <Route path='/rhythmic-realm/callback' element={<Callback/>} />
        {/* For use during production */}
        <Route path='/' element={<Main/>} />
        <Route path='/callback' element={<Callback/>} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  reactDiv
);

// Three JS inspector
// https://chrome.google.com/webstore/detail/threejs-inspector/dnhjfclbfhcbcdfpjaeacomhbdfjbebi?hl=en
// window.THREE = THREE;
// window.scene = scene;