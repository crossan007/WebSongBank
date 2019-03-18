import React, { Component } from 'react';

interface Song {
    Title: string,
    Authors: string[],
    CCLINumber: string,
    SongKeys: SongKey[],
    Links: Link[]
}

interface SongKey {
    PreferredBy: string[],
    Key: string,
    Links: Link[]
}

interface Link {
    URL: string,
    Title: string
}

const SongBlock: React.FunctionComponent<{song:Song}> = ({song}) => {
    
    
    if (song === undefined) {
    return <div></div>;
    }
    const displayStyle = {display: 'inline-block'};
    const singleSong = (
    <div>
        <h3 key={song.Title}>{song.Title}</h3>
        <div style={displayStyle}>
        <p>CCLI: {song.CCLINumber}</p>
        <p>Links:</p>
        <ul>
            {
            song.Links.map((link) => 
            <li><a href="{link.URL}">{link.Title}</a></li>
            )}
        </ul>
        </div>
        <div style={displayStyle}>
        {
            song.SongKeys.map((SongKey) => 
            <div>
                <h3>Song Key: {SongKey.Key}</h3>
                Preferred by:
                <ul> 
                {
                SongKey.PreferredBy.map((PreferredBy) => 
                <li>{PreferredBy}</li>
                )}
                </ul>
                Key Links:
                <ul>
                {
                    SongKey.Links.map((link) => 
                    <li><a href="{link.URL}">{link.Title}</a></li>
                    )}
                </ul>
            </div>
            )}
        </div>
    </div>
    );

    return (
    <div>{singleSong}</div>
    );
}


export default SongBlock