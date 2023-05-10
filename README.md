# Rhythmic Realm

This project is running on GitHub Pages [here](https://mgcallanan.github.io/rhythmic-realm/).

The written report for this project can be found [here](https://docs.google.com/document/d/1zPMKLReTEacgVBi15Viz3j3JMJLY_HwHLt-klsroOFI/edit?usp=sharing).

## Running the Project

Clone the project, remove the git repository and install to get going:

```bash
git clone https://github.com/mgcallanan/rhythmic-realm.git
cd rhythmic-realm
rm -rf .git
npm install
npm start
```

Then visit http://localhost:8080

To run the API locally, change the REDIRECT_URI in Main.jsx to the Production URI.

## npm scripts

- `npm start` - Build and start the app in development mode at http://localhost:8080
- `npm run build` - Run a production build, outputs to ./build/
- `npm run deploynob` - Deploy the app to GitHub Pages
- `npm run lint` - Lint your code

## CC Attributes

Floating island : https://poly.google.com/view/eEz9hdknXOi
Flower: https://poly.google.com/view/eydI4__jXpi

This project used starter code from the `advanced` branch of the Three Seed Github Project found [here](http://edwinwebb.github.io/three-seed/) in order to integrate ReactJS and ThreeJS.

## License

Copyright (c) 2018 Edwin Webb

MIT (http://opensource.org/licenses/MIT)
