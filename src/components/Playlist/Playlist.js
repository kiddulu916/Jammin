import React, { useState } from "react";
import styles from "./Playlist.module.css";
import Tracklist from "../Tracklist/Tracklist.js";

function Playlist(props) {
  const [selectedPlaylistName, setSelectedPlaylistName] = useState("");

  function handleNameChange({ target }) {
    props.onNameChange(target.value);
  }

  function handlePlaylistSelect({ target }) {
    const playlistId = target.value;
    const playlist = props.userPlaylists.find((pl) => pl.id === playlistId);

    if (playlist) {
      setSelectedPlaylistName(playlist.name); // Update the placeholder with the playlist name
      props.onLoad(playlistId); // Load selected playlist
    }
  }

  return (
    <>
      <div className={styles.Playlist}>
        <input
          value={props.playlistName}
          onChange={handleNameChange}
          placeholder={selectedPlaylistName || "New Playlist"}
        />
        <Tracklist
          userSearchResults={props.playlistTracks}
          onRemove={props.onRemove}
          isRemoval={true}
        />
        <div className={styles["playlist-buttons"]}>
          <div className={styles.topButtons}>
            <button className={styles.button} onClick={props.onSave}>
              SAVE PLAYLIST
            </button>
            <button className={styles.button} onClick={props.onClear}>
              CLEAR PLAYLIST
            </button>
          </div>
          <div className={styles.bottomButtons}>
            <select
              className={styles.dropdown}
              onChange={handlePlaylistSelect}
              defaultValue=""
              >
              <option value="" disabled>
                Select Playlist
              </option>
              {props.userPlaylists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </select>
            <button className={styles.button} onClick={props.onDelete}>
              DELETE PLAYLIST
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Playlist;