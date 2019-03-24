import * as types from "./actionTypes";
import * as songApi from "../../api/songApi";
import { Dispatch } from "redux";
import Song from "../../Interfaces/Song";

export function loadSongsSuccess(Songs:Song[]) {
  return { type: types.LOAD_SONGS_SUCCESS, Songs };
}

export function loadSongs() {
  return function(dispatch:Dispatch) {
    return songApi
      .getSongs()
      .then(Songs => {
        dispatch(loadSongsSuccess(Songs));
      })
      .catch(error => {
        throw error;
      });
  };
}
