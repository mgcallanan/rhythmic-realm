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
      sectionIndex: 0,
      sections: flowersAudioAnalysis.sections,
    };

    this.loadingFunction = (p) => {
      console.log('loading cube', p);
    };

    this.name = 'cube';
    this.load();
  }

  load() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x1db954 });
    const cube = new THREE.Mesh(geometry, material);

    this.cube = cube;
    // this.scale.set(20, 20, 20);
    // var tween = new TWEEN.Tween(cube.scale)
    //   .to({ y: 10 }, 3000)
    //   .easing(TWEEN.Easing.Cubic.Out)
    //   .start();
    this.add(cube);
  }

  update(timeStamp) {
    // console.log(timeStamp % this.state.bpmMilliSeconds);

    //denoising with mod since timestamp is never exact multiple

    //Scale cube up and down on beat
    if (timeStamp % this.state.bpmMilliSeconds < 50) {
      //   console.log('hey');
      this.scale.x += this.state.bpmFactor;
      this.scale.y += this.state.bpmFactor;
      this.scale.z += this.state.bpmFactor;
    }

    //change color on section change
    // if (this.state.sectionIndex < this.state.sections.length - 1) {
    //   const nextStart =
    //     this.state.sections[this.state.sectionIndex + 1].start * 1000;
    //   if (timeStamp % nextStart < 10) {
    //     this.state.sectionIndex += 1;
    //   }
    // }

    if (
      (this.scale.x <= 0.6 && this.scale.y <= 0.6 && this.scale.z <= 0.6) ||
      (this.scale.x >= 10 && this.scale.y >= 10 && this.scale.z >= 10)
    ) {
      this.state.bpmFactor *= -1;
    }
  }
}
