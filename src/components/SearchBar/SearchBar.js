import React, { useState } from 'react';
import styles from "./SearchBar.module.css"

// SearchBar component that takes props from parent (App.js)
const SearchBar = (props) => {
    // State to store the search term, initialized as empty string
    const [term, setTerm] = useState("");

    // Function to pass the search term back to parent component
    // Called when search button is clicked or Enter is pressed
    const passTerm = () => {
        props.onSearch(term);
    }

    // Event handler for input changes
    // Updates term state as user types
    const handleTermChange = ({ target }) => {
        setTerm(target.value);
    }

    // Event handler for keyboard events
    // Triggers search when Enter key is pressed
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            passTerm();
        }
    }

    return (
      <div className={styles.SearchBar}>
        <input 
          placeholder="Enter A Song, Album, or Artist" 
          onChange={handleTermChange}    // Called on every keystroke
          onKeyDown={handleKeyPress}     // Listens for Enter key
        />
        <button 
          className={styles.SearchButton} 
          onClick={passTerm}             // Triggers search on click
        >
          SEARCH
        </button>
      </div>
    );
}

export default SearchBar;
