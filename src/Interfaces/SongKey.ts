import SongLink from "./SongLink"

interface SongKey {
    PreferredBy: string[],
    Key: string,
    Links: SongLink[]
}

export default SongKey;