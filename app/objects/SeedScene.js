import { Group, Color } from 'three';
import Land from './Land/Land.js';
import Flower from './Flower/Flower.js';
import Cube from './Cube/Cube.js';
import BasicLights from './BasicLights';
import * as THREE from 'three';
import {
  flowersAudioAnalysis,
  flowersAudioFeatures,
  alaskaAudioAnalysis,
  alaskaAudioFeatures,
  good4uAudioAnalysis,
  good4uAudioFeatures,
  lizAudioAnalysis,
  lizAudioFeatures,
} from '../../data/spotify_data';
import { hexToRgb, rgbToHex } from './util.js';

export default class SeedScene extends Group {
  constructor() {
    super();

    // Init state
    this.state = {
      rotationSpeed: 2,
      updateList: [],
      sectionIndex: 0,
      sections: flowersAudioAnalysis.sections,
    };

    this.background = new Color(0xffffff);

    // const land = new Land();
    // const flower = new Flower();
    const cube = new Cube();
    const lights = new BasicLights();

    var song_rgb = {
      r: Math.round(flowersAudioFeatures.danceability * 255),
      g: Math.round(flowersAudioFeatures.energy * 255),
      b: Math.round(flowersAudioFeatures.acousticness * 255),
    };

    var song_rgb2 = {
      r: Math.round(flowersAudioFeatures.acousticness * 255),
      g: Math.round(flowersAudioFeatures.danceability * 255),
      b: Math.round(flowersAudioFeatures.energy * 255),
    };

    var song_hex = parseInt(rgbToHex(song_rgb).replace('#', '0x'));
    var song_hex2 = parseInt(rgbToHex(song_rgb2).replace('#', '0x'));

    var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({ color: song_hex });
    const material2 = new THREE.MeshStandardMaterial({ color: song_hex2 });

    if (flowersAudioFeatures.mode == 1) {
      geometry = new THREE.SphereGeometry(0.4, 42, 36)
    }

    var r_geometry = new THREE.TorusGeometry(8, 0.2, 16, 50)

    const obj_r = new THREE.Mesh(geometry, material);
    const obj_l = new THREE.Mesh(geometry, material);
    // console.log(cube_r)
    const ring = new THREE.Mesh(r_geometry, material2);

    var part_geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    // const obj_tmp = new THREE.Mesh(part_geometry, material);
    // this.tmp = obj_tmp;
    this.particles = [];
    this.movement = [[1, 1, 20],
                    [1, 1, -20],
                    [20, 1, 1],
                    [-20, 1, 1],
                    [1, 20, 1],
                    [1, -20, 1]];

    for (let i = 0; i < 6; i++) {
      const obj = new THREE.Mesh(part_geometry, material);
      this.particles.push(obj);
      this.add(this.particles[i]);
    }
    // console.log(this.particles);
    // console.log(this.movement);

    this.rad = 0;

    this.color_obj = rgbToHex(song_rgb);
    this.color_ring = rgbToHex(song_rgb2);

    obj_r.position.set(3,3,3);
    obj_l.position.set(-3,-3,-3);

    ring.rotateX(1.5);

    this.objects = [obj_r, obj_l, ring];

    console.log(this.objects);

    // this.add(land, flower, cube, lights);
    this.add(cube, obj_r, obj_l, ring, lights);
    this.addToUpdateList(cube);
    this.addToUpdateList(lights);
  }

  addToUpdateList(object) {
    // console.log(object);
    this.state.updateList.push(object);
  }

  update(timeStamp) {
    var second = timeStamp / 1000;
    // console.log(second)
    const { rotationSpeed, updateList } = this.state;

    this.rotation.y = (rotationSpeed * timeStamp * flowersAudioFeatures.tempo) / 500000;
    this.rotation.z = (rotationSpeed * timeStamp * flowersAudioFeatures.tempo) / 100000;

    // var ax = new THREE.Vector3(0.5,0.5,0.5);
    // ax.normalize();
    // var cube = updateList[0];
    var obj1 = this.objects[0];
    var obj2 = this.objects[1];
    var ring = this.objects[2];

    // obj2.rotateOnAxis(ax, this.rad + 0.3);

    ring.rotateY(flowersAudioFeatures.tempo / 15000);
    ring.rotateX(flowersAudioFeatures.tempo / 15000);

    // tester code for object movement
    // if (2 < second < 10) {
    //   var progress = Math.min(second / 8, 1);
    //   this.tmp.position.x = progress;
    //   this.tmp.position.y = progress;
    //   this.tmp.position.z = 10 * progress;
    // }
    // if (second > 10) {
    //   console.log("second > 10")
    //   this.tmp.position.x = 0;
    //   this.tmp.position.y = 0;
    //   this.tmp.position.z = 0;
    // }

    // particle animation
    if (this.state.sectionIndex > 0) {
      var section = this.state.sections[this.state.sectionIndex];
      const midpoint = section.start + (section.duration / 2);
      // console.log(midpoint);
      if (section.start < second && second < midpoint) {
        // console.log(second)
        var progress = Math.min((second - section.start) / (section.duration / 2), 1);
        // makes it move faster in the beginning
        progress = 1 - Math.pow(1 - progress, 3);
        // console.log(progress)
        for (let i = 0; i < 6; i++) {
          const mov = this.movement[i];
          this.particles[i].position.x = mov[0] * progress;
          this.particles[i].position.y = mov[1] * progress;
          this.particles[i].position.z = mov[2] * progress;
        }
      }
      else if (second > midpoint) {
        // console.log("back to origin")
        for (let i = 0; i < 6; i++) {
          // obj = this.particles[i];
          this.particles[i].position.x = 0;
          this.particles[i].position.y = 0;
          this.particles[i].position.z = 0;
        }
      }
    }

    // console.log(this.children)
    // var obj_r = this.objects[0];
    // var obj_l = this.objects[1];
    
    if (second > this.state.sections[this.state.sectionIndex].start + this.state.sections[this.state.sectionIndex].duration) {
      // console.log(second);
      // console.log(this.state.sections[this.state.sectionIndex]);
      // console.log(this.color_obj);
      var obj_color = hexToRgb(this.color_obj);
      // console.log(obj_color);
      var ring_color = hexToRgb(this.color_ring);

      this.state.sectionIndex += 1;
      var factor = this.state.sections[this.state.sectionIndex].key;
      factor += 1;
      factor /= 2;
      // console.log('factor')
      // console.log(obj_color);
      // console.log(factor)
      
      obj_color.r = Math.round(obj_color.r * factor);
      obj_color.g = Math.round(obj_color.g * factor);
      obj_color.b = Math.round(obj_color.b * factor);

      ring_color.r = Math.round(ring_color.r * factor);
      ring_color.g = Math.round(ring_color.g * factor);
      ring_color.b = Math.round(ring_color.b * factor);

      // console.log(obj_color);

      if (obj_color.r > 255) {
        obj_color.r = 255;
      }
      if (obj_color.g > 255) {
        obj_color.g = 255;
      }
      if (obj_color.b > 255) {
        obj_color.b = 255;
      }
      if (ring_color.r > 255) {
        ring_color.r = 255;
      }
      if (ring_color.g > 255) {
        ring_color.g = 255;
      }
      if (ring_color.b > 255) {
        ring_color.b = 255;
      }

      // console.log(obj_color);

      var obj_hex = parseInt(rgbToHex(obj_color).replace('#', '0x'));
      var ring_hex = parseInt(rgbToHex(ring_color).replace('#', '0x'));

      this.objects[0].material.color.set(obj_hex);
      this.objects[1].material.color.set(obj_hex);
      this.objects[2].material.color.set(ring_hex);

      // console.log(this.objects)
      // console.log(this.children)
    }
    this.rotation.x = (rotationSpeed * timeStamp) / 1000;
    this.rotation.y = (rotationSpeed * timeStamp) / 1000;

    // Call update for each object in the updateList
    for (const obj of updateList) {
      obj.update(timeStamp);
    }
  }
}
