/**
 * @exports Flower
 */

import { Group } from 'three';
import MODEL from './flower.json';
import TWEEN from '@tweenjs/tween.js';

import { loadScene } from '../../Loaders/loader';

export default class Flower extends Group {
  constructor() {
    super();

    this.loadingFunction = (p) => {
      console.log('loading flower', p);
    };
    this.name = 'flower';
    this.load();
  }

  async load() {
    const flower = await loadScene(MODEL, this.loadingFunction);
    flower.rotation.set(0, Math.PI, 0);
    flower.scale.set(1.2, 1.2, 1.2);
    this.flower = flower;

    this.add(flower);
  }

  spin() {
    // Add a simple twirl
    this.state.twirl += 6 * Math.PI;

    // Use timing library for more precice "bounce" animation
    // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
    // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
    const jumpUp = new TWEEN.Tween(this.position)
      .to({ y: this.position.y + 1 }, 300)
      .easing(TWEEN.Easing.Quadratic.Out);
    const fallDown = new TWEEN.Tween(this.position)
      .to({ y: 0 }, 300)
      .easing(TWEEN.Easing.Quadratic.In);

    // Fall down after jumping up
    jumpUp.onComplete(() => fallDown.start());

    // Start animation
    jumpUp.start();
  }

  update(timeStamp) {
    if (this.state.bob) {
      // Bob back and forth
      this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
    }
    if (this.state.twirl > 0) {
      // Lazy implementation of twirl
      this.state.twirl -= Math.PI / 8;
      this.rotation.y += Math.PI / 8;
    }

    // Advance tween animations, if any exist
    TWEEN.update();
  }
}
