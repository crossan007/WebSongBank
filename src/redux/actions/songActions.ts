import * as types from "./actionTypes";
import * as songApi from "../../api/songApi";
import { Dispatch } from "redux";
import Song from "../../Interfaces/Song";

export function loadSongsSuccess(songs:Song[]) {
  return { type: types.LOAD_SONGS_SUCCESS, songs };
}

export function loadSongs() {
  return function(dispatch:Dispatch) {
    console.log("loading songs(1)");
    return songApi
      .getSongs()
      .then(songs => {
        dispatch(loadSongsSuccess(songs));
      })
      .catch(error => {
        throw error;
      });
  };
}
