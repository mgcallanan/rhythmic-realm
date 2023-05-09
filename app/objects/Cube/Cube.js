/**
 * @exports Cube
 */
import * as THREE from 'three'; // used for Orbit Controls
import { Group } from 'three';
import TWEEN from '@tweenjs/tween.js';
import {
  flowersAudioAnalysis,
  flowersAudioFeatures,
  alaskaAudioAnalysis,
  alaskaAudioFeatures,
  good4uAudioAnalysis,
  good4uAudioFeatures,
  lizAudioAnalysis,
  lizAudioFeatures,
} from '../../../data/spotify_data';
import store from '../../stores/store';
import { hexToRgb, rgbToHex, rgbToHsv, hsvToRgb } from '../util.js';

export default class Cube extends Group {
  constructor() {
    super();

    this.state = {
      currentAudioAnalysis: flowersAudioAnalysis,
      currentAudioFeatures: flowersAudioFeatures,
      justScaledUp: false,
      bpmMilliSeconds: (60 / flowersAudioAnalysis.track.tempo) * 1000, // convert bpm to beats per second
      bpmFactor: 4,
      sectionIndex: 0,
      sections: flowersAudioAnalysis.sections,
      startScale: { x: 1, y: 1, z: 1 },
      endScale: { x: 5, y: 5, z: 5 },
    };

    store.subscribe(() => {
      console.log(this.state);
      const { song, currentAudioAnalysis, currentAudioFeatures } =
        store.getState().App;
      this.state.currentAudioAnalysis = currentAudioAnalysis;
      this.state.currentAudioFeatures = currentAudioFeatures;

      if (this.state.currentAudioAnalysis && this.state.currentAudioFeatures) {
        this.state.bpmMilliSeconds =
          (60 / this.state.currentAudioAnalysis.track.tempo) * 1000;
        this.state.sectionIndex = 0;
        this.state.sections = this.state.currentAudioAnalysis.sections;
      }
    });

    this.loadingFunction = (p) => {
      console.log('loading cube', p);
    };

    var song_rgb = {
      r: Math.round(flowersAudioFeatures.energy * 255),
      g: Math.round(flowersAudioFeatures.acousticness * 255),
      b: Math.round(flowersAudioFeatures.danceability * 255),
    };

    console.log(song_rgb);

    var song_hex = rgbToHex(song_rgb);

    // console.log(song_hex);

    this.name = 'cube';
    this.currcolor = parseInt(song_hex.replace('#', '0x'));
    this.cubecolor = parseInt(song_hex.replace('#', '0x'));
    this.hex = String(song_hex);
    // console.log(this.cubecolor)
    // store.subscribe( ()=>{
    //   // console.log("help")
    //   const { objectcolor } = store.getState().App;
    //   this.hex = objectcolor
    //   this.cubecolor = parseInt(objectcolor.replace('#', '0x'));
    //   this.currcolor = this.cubecolor;
    //   // console.log(this.cubecolor)
    // } )
    // console.log(this.cubecolor)
    this.load();
  }

  load() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: this.cubecolor });
    const cube = new THREE.Mesh(geometry, material);

    this.cube = cube;
    // this.scale.set(20, 20, 20);
    // var tween = new TWEEN.Tween(cube.scale)
    //   .to({ y: 10 }, 3000)
    //   .easing(TWEEN.Easing.Cubic.Out)
    //   .start();
    this.add(cube);
  }

  scaleObject() {
    TWEEN.removeAll();
    let EaseOut = TWEEN.Easing.Linear.None;
    let EaseIn = TWEEN.Easing.Linear.None;

    let objShrink = new TWEEN.Tween(this.scale)
      .to(this.state.startScale, this.state.bpmMilliSeconds)
      .easing(EaseIn);

    let objGrow = new TWEEN.Tween(this.scale)
      .to(this.state.endScale, this.state.bpmMilliSeconds)
      .easing(EaseOut);

    if (this.scale.x > 2.5) {
      objShrink.start();
    } else {
      objGrow.start();
    }

    // objGrow.chain(objShrink);
    // objGrow.start();

    // objGrow.start();

    //   if (shrink) {
    //   objShrink.start();
    // } else {
    //   objGrow.start();
    // }

    // this.state.bpmFactor *= -1;
  }

  update(timeStamp) {
    const second = timeStamp / 1000;
    // console.log(timeStamp % this.state.bpmMilliSeconds);

    //denoising with mod since timestamp is never exact multiple

    //Scale cube up and down on beat
    if (timeStamp % this.state.bpmMilliSeconds < 50) {
      this.scaleObject();
      //   console.log('hey');
      //   this.scale.x += this.state.bpmFactor;
      //   this.scale.y += this.state.bpmFactor;
      //   this.scale.z += this.state.bpmFactor;
    }

    // change color on section change
    // modified by loudness of respective section
    if (this.state.sectionIndex < this.state.sections.length - 1) {
      const nextStart =
        this.state.sections[this.state.sectionIndex + 1].start * 1000;
      if (timeStamp % nextStart < 20) {
        var factor = this.state.sections[this.state.sectionIndex].loudness;
        factor *= -2 / 60;
        // console.log(this.cubecolor)
        var rgb = hexToRgb(this.hex);

        // console.log(rgb)
        console.log(factor)

        // change to multiply if want to get darker for louder
        rgb.r = Math.round(rgb.r / factor);
        rgb.g = Math.round(rgb.g / factor);
        rgb.b = Math.round(rgb.b / factor);
        console.log(rgb)
        if (rgb.r > 255) {
          rgb.r = 255;
        }
        if (rgb.g > 255) {
          rgb.g = 255;
        }
        if (rgb.b > 255) {
          rgb.b = 255;
        }
        console.log(rgb)
        var hex = rgbToHex(rgb);
        var new_color = parseInt(hex.replace('#', '0x'));
        this.currcolor = new_color;
        // console.log(this.cubecolor);
        // console.log(new_color);
        // this.cubecolor = parseInt(hex_new.replace('#', '0x'));
        // this.hex = hex_new

        this.state.sectionIndex += 1;
      }
    }

    // this.cube.material.color.set(this.currcolor);

    const cube = this.cube;
    // console.log(cube)
    const material = new THREE.MeshStandardMaterial({ color: this.currcolor });
    cube.material = material;
    this.cube = cube;

    // if (
    //   (this.scale.x <= 0.6 && this.scale.y <= 0.6 && this.scale.z <= 0.6) ||
    //   (this.scale.x >= 10 && this.scale.y >= 10 && this.scale.z >= 10)
    // ) {
    //   console.log(this.scale, 'changing');
    //   this.state.bpmFactor *= -1;
    // }
    TWEEN.update();
  }
}
