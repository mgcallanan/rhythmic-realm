import { Group, Color } from 'three';
import Land from './Land/Land.js';
import Flower from './Flower/Flower.js';
import Cube from './Cube/Cube.js';
import BasicLights from './BasicLights';

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

    // this.add(land, flower, cube, lights);
    this.add(cube, lights);
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

    // Call update for each object in the updateList
    for (const obj of updateList) {
      obj.update(timeStamp);
    }
  }
}
