import React from "react";
import styles from "./SearchResults.module.css";
import Tracklist from "../Tracklist/Tracklist.js";

function SearchResults(props) {
  return (
    <div className={styles.SearchResults}>
      {props.heading && <h2>{props.heading}</h2>}
      <Tracklist
        userSearchResults={props.userSearchResults}
        isRemoval={false}
        onAdd={props.onAdd}
      />
    </div>
  );
}

export default SearchResults;