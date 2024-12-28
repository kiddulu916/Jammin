import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import SearchResults from "../SearchResults/SearchResults.js";
import Playlist from "../Playlist/Playlist.js";
import SearchBar from "../SearchBar/SearchBar.js";
import { Spotify } from "../../util/Spotify/Spotify.js";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Spotify.getUserPlaylists().then((playlists) => setUserPlaylists(playlists));
    Spotify.getUserTopTracks().then((tracks) => setRecommendedTracks(tracks));
  }, []);

  function clearCurrentPlaylist() {
    setPlaylistName("New Playlist");
    setPlaylistTracks([]);
    setCurrentPlaylistId(null);
  }

  function deleteCurrentPlaylist() {
    if (!currentPlaylistId) {
      setError("No playlist loaded to delete!");
      return;
    }
    setError(""); // Clear any previous errors
    Spotify.deletePlaylist(currentPlaylistId).then(() => {
      setUserPlaylists(userPlaylists.filter((pl) => pl.id !== currentPlaylistId));
      clearCurrentPlaylist();
    });
  }

  function addTrack(track) {
    const existingTrack = playlistTracks.find((t) => t.id === track.id);
    if (!existingTrack) {
      setPlaylistTracks([...playlistTracks, track]);
    }
  }

  function removeTrack(track) {
    const existingTrack = playlistTracks.filter((t) => t.id !== track.id);
    setPlaylistTracks(existingTrack);
  }

  function updatePlaylistName(name) {
    setPlaylistName(name);
  }

  function savePlaylist() {
    if (!playlistName.trim()) {
      setError("Playlist name cannot be empty");
      return;
    }
    const duplicate = userPlaylists.some((pl) => pl.name.toLowerCase() === playlistName.toLowerCase());
    if (duplicate) {
      setError("A playlist with this name already exists!");
      return;
    }
    setError("");
    const trackURIs = playlistTracks.map((t) => t.uri);
    Spotify.savePlaylist(playlistName, trackURIs).then(() => {
      updatePlaylistName("New Playlist");
      setPlaylistTracks([]);
    });
  }

  function search(term) {
    if (!term.trim()) {
      setError("Cannot leave search bar empty");
      return;
    }
    setError("");
    setIsSearching(true);
    setIsLoading(true);
    Spotify.search(term)
      .then((result) => {
        setSearchResults(result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function loadPlaylist(playlistId) {
    const playlist = userPlaylists.find((pl) => pl.id === playlistId);
    if (playlist) {
      setCurrentPlaylistId(playlistId);
      Spotify.getPlaylistTracks(playlist.tracks).then((tracks) => {
        setPlaylistName(playlist.name);
        setPlaylistTracks(tracks);
      });
    }
  }

  return (
    <div>
      <h1>
        Ja<span className={styles.highlight}>MMM</span>in <span className={styles["powered-by"]}>Powered by Spotify&copy;</span>  
      </h1>
      <div className={styles.App}>
        {error && <p className={styles.error}>{error}</p>}
        <SearchBar onSearch={search} />
        {isLoading && <div className={styles.loading}></div>}
        <div className={styles["App-playlist"]}>
          <SearchResults 
            userSearchResults={isSearching ? searchResults : recommendedTracks}
            heading={isSearching ? "" : "Recommended For You"} 
            onAdd={addTrack} 
          />

          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            userPlaylists={userPlaylists}
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist}
            onLoad={loadPlaylist}
            onDelete={deleteCurrentPlaylist}
            onClear={clearCurrentPlaylist}
          />
        </div>
      </div>
    </div>
  );
}

export default App;