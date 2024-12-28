let accessToken = "";
const clientID = "637204625e214cd6b4af3886a8a8dc24";
const redirectUrl = "http://localhost:3000";

export const Spotify = {
  getAccessToken() {
    // First check for the access token
    if (accessToken) return accessToken;

    const tokenInURL = window.location.href.match(/access_token=([^&]*)/);
    const expiryTime = window.location.href.match(/expires_in=([^&]*)/);

    // Second check for the access token
    if (tokenInURL && expiryTime) {
      // setting access token and expiry time variables
      accessToken = tokenInURL[1];
      const expiresIn = Number(expiryTime[1]);

      // Setting the access token to expire at the value for expiration time
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      // clearing the url after the access token expires
      window.history.pushState("Access token", null, "/");
      return accessToken;
    }

    // Third check for the access token if the first and second check are both false
    const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public%20playlist-modify-private%20playlist-read-private%20playlist-read-collaborative%20user-top-read%20user-read-email%20user-read-private&redirect_uri=${redirectUrl}`;
    window.location = redirect;
  },

  search(term) {
    accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        if (!jsonResponse) {
          console.error("Response error");
        }
        return jsonResponse.tracks.items.map((t) => ({
          id: t.id,
          name: t.name,
          artist: t.artists[0].name,
          album: t.album.name,
          uri: t.uri,
        }));
      });
  },

  getUserTopTracks() {
    const accessToken = Spotify.getAccessToken();
    return fetch('https://api.spotify.com/v1/me/top/tracks?limit=20', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(response => response.json())
      .then((jsonResponse) => {
        if (!jsonResponse.items) {
          return [];
        }
        return jsonResponse.items.map((t) => ({
          id: t.id,
          name: t.name,
          artist: t.artists[0].name,
          album: t.album.name,
          uri: t.uri,
        }));
      })
      .catch((error) => {
        console.error("Error fetching user top tracks:", error);
        return [];
      });
  },

  getUserPlaylists() {
    const accessToken = Spotify.getAccessToken();
    return fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(response => response.json())
      .then(jsonResponse => {
        if (!jsonResponse.items) {
          return [];
        }
        return jsonResponse.items.map(playlist => ({
          id: playlist.id,
          name: playlist.name,
          tracks: playlist.tracks.href
        }));
      });
  },
  
  deletePlaylist(playlistId) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete playlist. Status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error deleting playlist:", error);
      });
  },
  
  savePlaylist(name, trackUris) {
    if (!name || !trackUris) return;
    const aToken = Spotify.getAccessToken();
    const header = { Authorization: `Bearer ${aToken}` };
    let userId;
    return fetch(`https://api.spotify.com/v1/me`, { headers: header })
      .then((response) => response.json())
      .then((jsonResponse) => {
        userId = jsonResponse.id;
        let playlistId;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: header,
          method: "post",
          body: JSON.stringify({ name: name }),
        })
          .then((response) => response.json())
          .then((jsonResponse) => {
            playlistId = jsonResponse.id;
            return fetch(
              `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
              {
                headers: header,
                method: "post",
                body: JSON.stringify({ uris: trackUris }),
              }
            );
          });
      });
  },

  getPlaylistTracks(tracksUrl) {
    const accessToken = Spotify.getAccessToken();
    return fetch(tracksUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(jsonResponse => {
        if (!jsonResponse.items) {
          return [];
        }
        return jsonResponse.items.map(item => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists[0].name,
          album: item.track.album.name,
          uri: item.track.uri
        }));
      })
      .catch(error => {
        console.error("Error fetching playlist tracks:", error);
      });
  }
};
