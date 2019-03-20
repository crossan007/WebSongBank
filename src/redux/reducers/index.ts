import { combineReducers } from "redux";
import { Reducer } from 'redux';
import AppState from "../../Interfaces/AppState";
import * as types from "../actions/actionTypes";



export const initialState :AppState = {
  Songs: [{
    Authors:[],
    CCLINumber:"asdF",
    Links:[],
    SongKeys:[],
    Title:"asdf"
  }],
  SongSets: []
}


const rootReducer: Reducer<AppState,any> = (state: AppState = initialState, action) => {
  switch (action.type) {
    case types.CREATE_SONG:
      return {...state, Songs: action.Song };
    case types.LOAD_SONGS_SUCCESS:
      return {...state, Songs: action.Songs };
    default:
      return initialState;
  }
}

export default rootReducer;
