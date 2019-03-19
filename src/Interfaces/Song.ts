import SongKey from "./SongKey";
import SongLink from "./SongLink";

interface Song {
    Title: string,
    Authors: string[],
    CCLINumber?: string,
    SongKeys?: SongKey[],
    Links?: SongLink[]
}

export default Song;