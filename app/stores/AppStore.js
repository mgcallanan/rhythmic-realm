const ISCALE = 'app/IslandScale';
const DIRITEN = 'app/diriten';
const LIGHTCOLOR = 'app/lightcolor';
const OBJECTCOLOR = 'app/objectcolor';
const SONG = 'app/song';
const AUDIOANALYSIS = 'app/audioAnalysis';
const AUDIOFEATURES = 'app/audioFeatures';
const FETCHTIMESTAMP = 'app/fetchTimeStamp';
const SONGPROGRESS = 'app/songProgress';
import * as SPOTIFY_DATA from '../../data/spotify_data';

export default (
  state = {
    islandScale: 1,
    dirinten: 1.15,
    lightcolor: '#FEFEFE',
    objectcolor: '#FEFEFE',
    song: 'flowers',
    currentAudioAnalysis: SPOTIFY_DATA.flowersAudioAnalysis,
    currentAudioFeatures: SPOTIFY_DATA.flowersAudioFeatures,
  },
  action = {}
) => {
  switch (action.type) {
    case ISCALE: {
      return {
        ...state,
        islandScale: action.value,
      };
    }
    case DIRITEN: {
      return {
        ...state,
        dirinten: action.value,
      };
    }
    case LIGHTCOLOR: {
      return {
        ...state,
        lightcolor: action.value,
      };
    }
    case OBJECTCOLOR: {
      return {
        ...state,
        objectcolor: action.value,
      };
    }
    case SONG: {
      let currentAudioAnalysis = {};
      let currentAudioFeatures = {};
      const song = action.value;
      if (song == 'alaska') {
        currentAudioAnalysis = SPOTIFY_DATA.alaskaAudioAnalysis;
        currentAudioFeatures = SPOTIFY_DATA.alaskaAudioFeatures;
      } else if (song == 'liz') {
        currentAudioAnalysis = SPOTIFY_DATA.lizAudioAnalysis;
        currentAudioFeatures = SPOTIFY_DATA.lizAudioFeatures;
      } else if (song == 'good4u') {
        currentAudioAnalysis = SPOTIFY_DATA.good4uAudioAnalysis;
        currentAudioFeatures = SPOTIFY_DATA.good4uAudioFeatures;
      } else if (song == 'flowers') {
        currentAudioAnalysis = SPOTIFY_DATA.flowersAudioAnalysis;
        currentAudioFeatures = SPOTIFY_DATA.flowersAudioFeatures;
      }
      return {
        ...state,
        song: song,
        currentAudioAnalysis: currentAudioAnalysis,
        currentAudioFeatures: currentAudioFeatures,
      };
    }
    case AUDIOANALYSIS: {
      return {
        ...state,
        currentAudioAnalysis: action.value,
      };
    }
    case AUDIOFEATURES: {
      return {
        ...state,
        currentAudioFeatures: action.value,
      };
    }
    case FETCHTIMESTAMP: {
      return {
        ...state,
        fetchTimeStamp: action.value,
      };
    }
    case SONGPROGRESS: {
      return {
        ...state,
        songProgress: action.value,
      };
    }
    default:
      return state;
  }
};

export const setIslandScale = (value) => ({
  type: ISCALE,
  value,
});

export const setDirIten = (value) => ({
  type: DIRITEN,
  value,
});

export const setLightColor = (value) => ({
  type: LIGHTCOLOR,
  value,
});

export const setObjectColor = (value) => ({
  type: OBJECTCOLOR,
  value,
});

export const setSong = (value) => ({
  type: SONG,
  value,
});

export const setAudioAnalysis = (value) => ({
  type: AUDIOANALYSIS,
  value,
});

export const setAudioFeatures = (value) => ({
  type: AUDIOFEATURES,
  value,
});

export const setFetchTimeStamp = (value) => ({
  type: FETCHTIMESTAMP,
  value,
});

export const setSongProgress = (value) => ({
  type: SONGPROGRESS,
  value,
});
