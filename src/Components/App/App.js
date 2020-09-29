import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      //dont need hard coded values anymore as we have set up requests from spotify API
      //   {name: 'nameA', artist: 'artistA', album: 'albumA', id: 'idA'},
      //   {name: 'nameB', artist: 'artistB', album: 'albumB', id: 'idB'}
      // ],
      playlistName: 'New Vibing Playlist',
      playlistTracks: []
      //   {name: 'nameC', artist: 'artistC', album: 'albumC', id: 'idC'},
      //   {name: 'nameD', artist: 'artistD', album: 'albumD', id: 'idD'}
      // ]
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  
  //methods
  //i dont know how to do this
  search(searchTerm) {
    Spotify.search(searchTerm).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
  }

  addTrack(track) {
    //if doesnt work add a let tracks = this.state.playlistTracks and replace it with this var
    let tracks = this.state.playlistTracks;
    if(tracks.find(el => el.id === track.id)) {
      return; //returns the function if the element in the array's id value === the argument track.id
    } else {
    //else add the track to the array and set state of playlistTracks to this.state.playlistTracks
    tracks.push(track);
    this.setState(
      {playlistTracks: tracks}
    );
  }
}

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    //set this.state.playlistTracks in the New Playlist Tracklist to remove a track
    //use a track's id to remove it from the Playlist
    //if track id for each el in array is not equal to the selected track's id, return it to the playlist array
    //so if the selected el's id = a track in the array's id, it is not added to the new playlist array. 
    //aka it looks like it is removed bc its not added to the updated new array
    tracks = tracks.filter(el => el.id !== track.id);
      
    //this.state.playlistTracks.pop(track);
    this.setState(
      {playlistTracks: tracks}
    );
  }

  updatePlaylistName(playlistName) {
    this.setState({playlistName: playlistName});
  }

  //You will create an array containing the uri of each track in the playlistTracks property.
  //In a later section, you will pass the playlist name and the array of uris to a Spotify-linked 
  //method that writes the tracks in playlistTracks to a user’s account.
  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(
      this.setState({playlistName: 'New Playlist',
                    playlistTracks: [] 
                  })
    );
    
  }
  

  render() {
  return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch={this.search} />
        <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} 
                          onAdd={this.addTrack} />
          <Playlist playlistName={this.state.playlistName}
                    playlistTracks={this.state.playlistTracks} 
                    onRemove={this.removeTrack}
                    onNameChange={this.updatePlaylistName}
                    onSave={this.savePlaylist} />
        </div>
      </div>
    </div>
  )};
}

export default App;
//in <SearchResults /> class instance we have made a new property called searchResults and 
//set it to the state of this.state.searchResults
//we need to pass the property into the SearchResults class which is in SearchResults.js
//as {this.props.searchResults} it is not a state but a propety as we added in the instance.