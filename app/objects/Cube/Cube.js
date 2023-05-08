/**
 * @exports Cube
 */
import * as THREE from 'three'; // used for Orbit Controls
import { Group } from 'three';
import TWEEN from '@tweenjs/tween.js';
import {
  flowersAudioAnalysis,
  flowersAudioFeatures,
} from '../../../data/spotify_data';

export default class Cube extends Group {
  constructor() {
    super();

    this.state = {
      justScaledUp: false,
      bpmMilliSeconds: (60 / flowersAudioAnalysis.track.tempo) * 1000, // convert bpm to beats per second
      bpmFactor: 0.5,
    };

    this.loadingFunction = (p) => {
      console.log('loading cube', p);
    };

    this.name = 'cube';
    this.load();
  }

  load() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    // cube.rotation.set(0, Math.PI, 0);
    // cube.scale.set(1.2, 1.2, 1.2);
    this.cube = cube;
    // this.scale.set(20, 20, 20);
    // var tween = new TWEEN.Tween(cube.scale.y)
    //   .to({ y: 10 }, 3000)
    //   .easing(TWEEN.Easing.Cubic.Out)
    //   .start();
    this.add(cube);
  }

  update(timeStamp) {
    // console.log(timeStamp % this.state.bpmMilliSeconds);
    if (timeStamp % this.state.bpmMilliSeconds < 50) {
      //   console.log('hey');
      this.scale.x += this.state.bpmFactor;
      this.scale.y += this.state.bpmFactor;
      this.scale.z += this.state.bpmFactor;
    }

    if (
      (this.scale.x <= 0.6 && this.scale.y <= 0.6 && this.scale.z <= 0.6) ||
      (this.scale.x >= 10 && this.scale.y >= 10 && this.scale.z >= 10)
    ) {
      this.state.bpmFactor *= -1;
    }
  }
}
