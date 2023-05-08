/**
 * @exports Cube
 */
import * as THREE from 'three'; // used for Orbit Controls
import { Group } from 'three';
import store from '../../stores/store';
import TWEEN from '@tweenjs/tween.js';
import {
  alaskaAudioAnalysis,
  alaskaAudioFeatures,
  flowersAudioAnalysis,
  flowersAudioFeatures,
  good4uAudioAnalysis,
  good4uAudioFeatures,
  lizAudioAnalysis,
  lizAudioFeatures,
} from '../../../data/spotify_data';

export default class Cube extends Group {
  constructor() {
    super();

    this.state = {
      currentAudioAnalysis: flowersAudioAnalysis,
      currentAudioFeatures: flowersAudioFeatures,
      justScaledUp: false,
      bpmMilliSeconds: (60 / flowersAudioAnalysis.track.tempo) * 1000, // convert bpm to beats per second
      bpmFactor: 0.5,
      sectionIndex: 0,
      sections: flowersAudioAnalysis.sections,
    };

    store.subscribe(() => {
      const { song, currentAudioAnalysis, currentAudioFeatures } =
        store.getState().App;
      this.state.currentAudioAnalysis = currentAudioAnalysis;
      this.state.currentAudioFeatures = currentAudioFeatures;

      this.state.bpmMilliSeconds =
        (60 / this.state.currentAudioAnalysis.track.tempo) * 1000;
      this.state.sectionIndex = 0;
      this.state.sections = this.state.currentAudioAnalysis.sections;
    });

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

    if (
      (this.scale.x <= 0.6 && this.scale.y <= 0.6 && this.scale.z <= 0.6) ||
      (this.scale.x >= 10 && this.scale.y >= 10 && this.scale.z >= 10)
    ) {
      if (this.scale.x <= 0.6 && this.scale.y <= 0.6 && this.scale.z <= 0.6) {
        this.scale.x = 0.6;
        this.scale.y = 0.6;
        this.scale.z = 0.6;
      } else {
        this.scale.x = 10;
        this.scale.y = 10;
        this.scale.z = 10;
      }
      this.state.bpmFactor *= -1;
    }
  }
}
