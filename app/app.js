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
import SeedScene from './objects/Scene.js';
import { ShaderPass, RenderPass } from './Renderer/EffectRenderer';
import { FXAAShader } from './Shaders/fxaa/fxaa';

// React  Imports
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './stores/store';
import Main from './components/Main.jsx';

// Set up scene
const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
const renderer = new Renderer({ antialias: false }, scene, camera);

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
  // controls.update();
  // renderer.render(scene, camera);
  seedScene.update(timeStamp);
  window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Renderer Go!
renderer.renderer.setClearColor(0x7ec0ee, 1);
renderer.start();

// React
render(
  <Provider store={store}>
    <Main />
  </Provider>,
  reactDiv
);

// Three JS inspector
// https://chrome.google.com/webstore/detail/threejs-inspector/dnhjfclbfhcbcdfpjaeacomhbdfjbebi?hl=en
// window.THREE = THREE;
// window.scene = scene;
