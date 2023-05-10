import {
  Group,
  SpotLight,
  PointLight,
  AmbientLight,
  HemisphereLight,
  Color,
} from 'three';
import {
  flowersAudioAnalysis,
  flowersAudioFeatures,
  alaskaAudioAnalysis,
  alaskaAudioFeatures,
} from '../../data/spotify_data';
import store from '../stores/store';
import { hexToRgb, rgbToHex, rgbToHsv, hsvToRgb } from './util.js';

export default class BasicLights extends Group {
  constructor(...args) {
    super(...args);

    this.state = {
      segments: flowersAudioAnalysis.segments,
      segmentIndex: 0,
    };

    store.subscribe(() => {
      const { currentAudioAnalysis, currentAudioFeatures } =
        store.getState().App;
      this.state.segments = currentAudioAnalysis.segments;
      this.segmentIndex = 0;
    });

    const point = new PointLight(0xffffff, 1, 10, 1);
    var dir = new SpotLight(0xffffff, 0.8, 7, 0.8, 1, 1);
    const ambi = new AmbientLight(0x404040, 0.66);
    const hemi = new HemisphereLight(0xffffbb, 0x080820, 1.15);

    var song_rgb = {
      r: Math.round(flowersAudioFeatures.acousticness * 255),
      g: Math.round(flowersAudioFeatures.danceability * 255),
      b: Math.round(flowersAudioFeatures.energy * 255),
    };

    var song_hex = rgbToHex(song_rgb);
    this.hex = song_hex;
    song_hex = parseInt(song_hex.replace('#', '0x'));

    this.dir = dir;
    dir.position.set(5, 1, 2);
    dir.target.position.set(0, 0, 0);

    point.position.set(0, 1, 5);

    this.add(ambi, hemi, dir);

    store.subscribe(() => {
      const { dirinten, lightcolor } = store.getState().App;
      // const col = parseInt(lightcolor.replace('#', '0x'));
      dir.intensity = dirinten;
      // dir.color = new Color(col);
    });

    this.name = 'lights';
    this.startcolor = song_hex;
    this.currcolor = song_hex;

    dir.color = new Color(song_hex);
    dir.intensity = flowersAudioFeatures.energy * 5;
  }

  update(timeStamp) {
    const second = timeStamp / 1000;
    // console.log('light updating')

    if (
      second > this.state.segments[this.state.segmentIndex].start &&
      this.state.segmentIndex < this.state.segments.length
    ) {
      this.state.segmentIndex += 1;
      var factor = this.state.segments[this.state.segmentIndex].loudness_max;
      factor *= -1 / 30;

      var rgb = hexToRgb(this.hex);
      // console.log(this.startcolor)
      rgb.r = Math.round(rgb.r / factor);
      rgb.g = Math.round(rgb.g / factor);
      rgb.b = Math.round(rgb.b / factor);
      if (rgb.r > 255) {
        rgb.r = 255;
      }
      if (rgb.g > 255) {
        rgb.g = 255;
      }
      if (rgb.b > 255) {
        rgb.b = 255;
      }
      var hex = rgbToHex(rgb);
      var new_color = parseInt(hex.replace('#', '0x'));
      // console.log(new_color);
      this.currcolor = new_color;
    }

    var dir = this.dir;
    dir.color = new Color(this.currcolor);
    // console.log(this.dir);
  }
}
