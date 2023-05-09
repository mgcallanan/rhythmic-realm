import { Scene, Color } from 'three';
import Land from './Land/Land.js';
import Flower from './Flower/Flower.js';
import Cube from './Cube/Cube.js';
import BasicLights from './BasicLights.js';

export default class SpotifyScene extends Scene {
  constructor() {
    super();

    // Init state
    this.state = {
      currentColor: new Color(0x212121),
      newColor: new Color(0xffffff),
      updateList: [],
    };

    this.background = new Color(0x212121);

    // const land = new Land();
    // const flower = new Flower();
    // const cube = new Cube();
    // const lights = new BasicLights();

    // this.add(land, flower, cube, lights);
    // this.add(cube, lights);
    // this.addToUpdateList(cube);
  }

  addToUpdateList(object) {
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
