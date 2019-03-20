import Song from './Song';
import SongSet from "./SongSet";

export default interface AppState {
    Songs: Song[],
    SongSets: SongSet[]
  }