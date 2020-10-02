const clientId = '';
//const redirectURI = "http://jamming_playlist_maker.surge.sh";
//const redirectURI = 'http://localhost:3000';
const redirectURI = "https://jamming-playlist-maker.netlify.app";

//If the user grants access, the final URL will contain a hash fragment with the following data encoded as a query string. For example:
//const exampleUrlFromSpotify = 'https://example.com/callback#access_token=NwAExz...BV3O2Tk&token_type=Bearer&expires_in=3600&state=123';
const regexAccessToken = /access_token=([^&]*)/;
const regexExpirationTime = /expires_in=([^&]*)/;

//if (exampleUrlFromSpotify.match(regexAccessToken, regexExpirationTime)) {
    //Set the access token value

    //Set a variable for expiration time

    //Set the access token to expire at the value for expiration time

    
//}
// const endpoint = /v1/search?type=TRACK;

let accessToken;

const Spotify = {
    getAccessToken() {
        //if accessToken has a value, return it
        if (accessToken) {
            return accessToken;
        }
        //if not set, check current url to see if it has just been obtained
        //use impicit grant flow as shown on spotify documentation
        const accessTokenMatch = window.location.href.match(regexAccessToken);
        const expirationTimeMatch = window.location.href.match(regexExpirationTime);
        
        //if both match, set accessToken and expirationTime value to these
        //note index [1] is used as with match() method index [0] returns the 
        //entire parsed string so 'access_token=whateverMatches'
        //whilst index [1] returns 'whateverMatches'
        //stackoverflow.com/questions/2295657/return-positions-of-a-regex-match-in-javascript and docs at match() section 
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
        if (accessTokenMatch && expirationTimeMatch) {
            accessToken = accessTokenMatch[1];
            const expirationTime = Number(expirationTimeMatch)[1];


            //Clear the parameters from the URL, so the app doesn’t try grabbing the access token after it has expired
            window.setTimeout(() => accessToken = '', expirationTime * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;

        } else {
            //redirect user to this spotify url
            window.location = 'https://accounts.spotify.com/authorize?client_id='+clientId+'&response_type=token&scope=playlist-modify-public&redirect_uri='+redirectURI;
        }
    },

    //returning undefined of then in App.js search()
    search(searchTerm) {
        //app.setState({searchResults: tracks});
        //need access to access token from getAccessToken() method.
        const accessToken = Spotify.getAccessToken();

        return fetch('https://api.spotify.com/v1/search?type=track&q='+searchTerm , {
            headers: {Authorization: 'Bearer ' + accessToken}
        }).then(response => {
        //    if(response.ok) {
                return response.json();
        //     };
        //     throw new Error('Request failed');
        // }, networkError => {
        //     console.log(networkError.message);

    
        }).then(jsonResponse => {
                //if the jsonReponse has no tracks property, return an empty array else return an array of objs
                ////says tracks of undefined??
                if(!jsonResponse.tracks) {
                    return [];
                } 
                return jsonResponse.tracks.items.map(track => ({
                    //see spotify api endpoint reference 'Search' 'Track Object - Full' for these 
                    //eg artists is an array of artist objects. Here we list the first artist's name prop in the array
                     
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    })
                );
                
            })
    },
        

        savePlaylist(playlistName, trackURIs) {
            //if name is falsy or trackURIs array is empty, return. aka ends the code block
            if(!playlistName || !trackURIs.length) {
                return;
            }
            //can use our method call to return the getaccessToken() outcome
            const accessToken = Spotify.getAccessToken();
            const headers = {Authorization: 'Bearer ' + accessToken};
            let userID;

            //current user endpoint GET https://api.spotify.com/v1/me
            return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => {
                //if(response.ok) {
                    return response.json();
                //};
                //throw new Error('User not found');
            //}, networkError => {
                //console.log(networkError.message);
            }).then(jsonResponse => {
                userID = jsonResponse.id;
                
                //endpoint to create a new playlist POST request POST https://api.spotify.com/v1/users/{user_id}/playlists
                return fetch('https://api.spotify.com/v1/users/'+userID+'/playlists', { 
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ playlistName: playlistName })
                }).then(response => {
                    //if(response.ok) {
                        return response.json();
                    //}
                    //throw new Error('Post request failed');
                //}, networkError => {
                    //console.log(networkError.message);
                }).then(jsonResponse => {
                    const playlistID = jsonResponse.id;

                    //embedded fetch to POST tracks to the playlist
                    //do not understand why each fetch has return before it in solution
                    //can I add return to end?
                    return fetch('https://api.spotify.com/v1/'+userID+'playlists/'+playlistID+'/tracks', {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({ uris: trackURIs })
                    })
                })
            });

            
        }
    };
    



export default Spotify;