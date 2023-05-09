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

export default class SeedScene extends Group {
  constructor() {
    super();

    // Init state
    this.state = {
      rotationSpeed: 2,
      updateList: [],
    };

    this.background = new Color(0xffffff);

    const land = new Land();
    const flower = new Flower();
    const cube = new Cube();
    const lights = new BasicLights();

    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({ color: "#ffffff" });
    const cube_r = new THREE.Mesh(geometry, material);
    const cube_l = new THREE.Mesh(geometry, material);

    // console.log(cube_r)

    cube_r.position.set(5,5,5);
    cube_l.position.set(-5,-5,-5);
    
    // cube_r.position = new Vector3(10,10,10)

    // this.add(land, flower, cube, lights);
    this.add(cube, cube_r, cube_l, lights);
    this.addToUpdateList(cube);
    this.addToUpdateList(lights);
  }

  addToUpdateList(object) {
    // console.log(object);
    this.state.updateList.push(object);
  }

  update(timeStamp) {
    const { rotationSpeed, updateList } = this.state;
    this.rotation.y = (rotationSpeed * timeStamp) / 10000;
    this.rotation.z = (rotationSpeed * timeStamp) / 10000;

    // Call update for each object in the updateList
    for (const obj of updateList) {
      obj.update(timeStamp);
    }
  }
}
