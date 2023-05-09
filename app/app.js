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
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Styles
import './styles.css';

let SECTION_INDEX = 0;
let SECTIONS = flowersAudioAnalysis.sections;
let LERPING = false;
// Set up scene
// const scene = new Scene();
const spotifyScene = new SpotifyScene();
// scene.background = new THREE.Color(0x212121);

const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
const renderer = new Renderer({ antialias: false }, spotifyScene, camera);

// Post processing
const rPass = new RenderPass(spotifyScene, camera);
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
  // set camera
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  // update the FXAA pass
  renderer.passes[1].uniforms.resolution.value.set(
    width * resolution,
    height * resolution
  );
});

// Camera, Controls and Scene
const OrbitControls = require('three-orbit-controls')(THREE); // yuk
const seedScene = new SeedScene();

new OrbitControls(camera, renderer.domElement);
// scene.add(seedScene);
spotifyScene.add(seedScene);
spotifyScene.addToUpdateList(seedScene);
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
  // if (SECTION_INDEX < SECTIONS.length - 1) {
  //   const nextStart = SECTIONS[SECTION_INDEX + 1].start * 1000;
  //   // console.log(SECTION_INDEX, SECTIONS, timeStamp % nextStart);

  //   if (timeStamp % nextStart < 20) {
  //     LERPING = true;
  //     SECTION_INDEX += 1;
  //     newColor.setHex(Math.random() * 0xffffff);

  //     currentColor.copy(scene.background);
  //     console.log(currentColor);

  //     // from here: https://jsfiddle.net/prisoner849/1k397beg/

  //     console.log('next');
  //   }
  // }

  // if (LERPING) {
  //   let s = Math.sin(timeStamp * 2.0) * 0.5 + 0.5;
  //   // console.log(s);
  //   scene.background.copy(currentColor).lerp(newColor, s);
  //   if (s >= 1.0) {
  //     LERPING = false;
  //   }
  // }
  // controls.update();
  // renderer.render(scene, camera);
  // seedScene.update(timeStamp);
  spotifyScene.update(timeStamp);
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
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main/>} />
        {/* <Route path='/callback' element={<Callback/>} /> */}
      </Routes>
    </BrowserRouter>
  </Provider>,
  reactDiv
);

// Three JS inspector
// https://chrome.google.com/webstore/detail/threejs-inspector/dnhjfclbfhcbcdfpjaeacomhbdfjbebi?hl=en
// window.THREE = THREE;
// window.scene = scene;
