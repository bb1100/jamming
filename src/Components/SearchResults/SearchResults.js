import React from 'react';
import TrackList from '../TrackList/TrackList';
import './SearchResults.css';

class SearchResults extends React.Component {
    render() {
        return (
            <div className="SearchResults">
                <h2>Results</h2>
                <TrackList tracks={this.props.searchResults} 
                            onAdd={this.props.onAdd} 
                            isRemoval={false} />
            </div>
    )};
};

export default SearchResults;
//we have passed in the property from App.js <SearchResults searchResults=... /> to <TrackList />
//as an attribute called tracks
//comment out other instances of <TrackList /> in other files for now or it wil error