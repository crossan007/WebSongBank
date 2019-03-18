
const songs = [ 
    {
      Title: "Test song",
      Authors: [
        "Bethel",
      ],
      CCLINumber: "8675309",
      SongKeys: [
        {
          PreferredBy: [
            "Matt",
            "Dan"
          ],
          Key: "F",
          Links: [
            {
              URL: "http://LinkToTheSongInE",
              Title: "The Song in F"
            }
          ]
        },
        {
          PreferredBy: [
            "Michale",
          ],
          Key: "G",
          Links: [
              {
                URL: "http://LinkToTheSongInB",
                Title: "The Song in G"
              }
          ]
  
        }
      ],
      Links: [
          {
            URL: "http://Youtube",
            Title: "The original song"
          }
      ]
    },
    {
      Title: "The other simple test song",
      Authors: [
        "Bethel",
        "Matt maher",
        "The other Matt (Redmond)"
      ],
      CCLINumber: "8675309",
      SongKeys: [
        {
          PreferredBy: [
            "Anna",
            "Lindsey"
          ],
          Key: "E",
          Links: [
            {
              URL: "http://LinkToTheSongInE",
              Title: "The Song in E"
            }
          ]
        },
        {
          PreferredBy: [
            "Michale",
            "Matt",
            "Amanda"
          ],
          Key: "B",
          Links: [
              {
                URL: "http://LinkToTheSongInB",
                Title: "The Song in B"
              }
          ]
  
        }
      ],
      Links: [
          {
            URL: "http://Youtube",
            Title: "The original song"
          },
          {
            URL: "http://CCLI",
            Title: "SongSelect Link"
          },
          {
            URL: "http://Youtube",
            Title: "SomeAuthor'sHomePageWithAStory"
          }
      ]
    }
  ];


  export default songs;