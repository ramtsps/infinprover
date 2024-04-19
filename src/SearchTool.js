import React, { useState } from "react";
import { MdClear } from "react-icons/md"; // Import the close icon from react-icons
import { PulseLoader } from "react-spinners";

const SearchTool = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [googleResults, setGoogleResults] = useState([]);
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [loading, setLoading] = useState(false); // State to control the visibility of the spinner
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSearch = () => {
    const query = encodeURIComponent(`${title} ${description}`).replace(
      /%20/g,
      "+"
    );
    if (query === "") {
      alert("Please enter project title and description.");
      return;
    }

    setLoading(true); // Show spinner when search is initiated

    // Clear previous search results
    setGoogleResults([]);
    setYoutubeResults([]);
    setSearchPerformed(true);

    // Use cors-anywhere proxy to bypass CORS restrictions
    const corsAnywhereProxyUrl = "https://cors-anywhere.herokuapp.com/";
    fetch(
      corsAnywhereProxyUrl + `https://skpartscollege.in/check/serv/saveing.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ links: selectedItems.map((item) => item.link) }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error("Error saving links:", error);
      });

    // Perform Google search
    fetch(
      `https://www.googleapis.com/customsearch/v1?key=AIzaSyAwiY5KqOlud-7Yl081tzsY9oeWC9eMexE&cx=d1d61ed55479845f5&q&q=${query}&num=5`
    )
      .then((response) => response.json())
      .then((data) => {
        setGoogleResults(data.items || []);
      })
      .catch((error) =>
        console.error("Error fetching Google search data:", error)
      );

    // Perform YouTube search
    fetch(
      `https://www.googleapis.com/youtube/v3/search?key=AIzaSyAwiY5KqOlud-7Yl081tzsY9oeWC9eMexE&q=${query}&part=snippet&type=video&maxResults=5`
    )
      .then((response) => response.json())
      .then((data) => {
        setYoutubeResults(data.items || []);
      })
      .catch((error) => console.error("Error fetching YouTube data:", error))
      .finally(() => {
        setLoading(false); // Hide spinner when search results are loaded
      });
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setGoogleResults([]);
    setYoutubeResults([]);
    setSearchPerformed(false);
  };

  const handleCheckboxChange = (event, item) => {
    if (event.target.checked) {
      setSelectedItems((prevItems) => [...prevItems, item]);
    } else {
      setSelectedItems((prevItems) =>
        prevItems.filter((selectedItem) => selectedItem !== item)
      );
    }
  };

  // const handleSave = () => {
  //   // Extract selected checkbox links
  //   const selectedLinks = googleResults.filter((item) =>
  //     selectedItems.includes(item)
  //   );
  //   // console.log(selectedLinks);
  //   console.log("items", selectedItems);

  //   // Send POST request to backend
  //   fetch("http://localhost:3000/serv/saveing.php", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       // "Access-Control-Allow-Origin": "http://localhost:3000",
  //     },
  //     body: JSON.stringify({ links: selectedItems.map((item) => item.link) }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data.message);
  //       alert(data.message);
  //     })
  //     .catch((error) => {
  //       console.error("Error saving links:", error);
  //     });
  // };
  const handleSave = () => {
    // Extract selected checkbox links from Google Results and YouTube Results separately
    const selectedGoogleLinks = googleResults
      .filter((item) => selectedItems.includes(item))
      .map((item) => item.link);

    const selectedYoutubeLinks = youtubeResults
      .filter((item) => selectedItems.includes(item))
      .map((item) => `https://www.youtube.com/watch?v=${item.id.videoId}`);

    // Combine selected links from both sources
    const selectedLinks = [...selectedGoogleLinks, ...selectedYoutubeLinks];
    console.log("links", selectedLinks);
    // Send POST request to backend
    fetch("https://skpartscollege.in/check/serv/saveing.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "http://localhost:3000",
      },
      body: JSON.stringify({ links: selectedLinks }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        alert(data.message);
      })
      .catch((error) => {
        console.error("Error saving links:", error);
        alert("Error saving links:", error.message);
      });
  };
  const handleLoadPlagiarismDetector = () => {
    window.open("https://plagiarismdetector.net/", "_blank");
  };
  return (
    <div className="container">
      <div className="row">
        <div className="left-section col-sm-12 col-lg-6 col-md-6">
          <h2>Project Verification Tool</h2>
          <div className="search-bar">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title..."
              style={{ fontSize: "14px" }}
            />
            {title && (
              <MdClear className="clear-icon" onClick={() => setTitle("")} />
            )}
          </div>
          <div className="search-bar">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description..."
              style={{ fontSize: "14px" }}
            />
            {description && (
              <MdClear
                className="clear-icon"
                onClick={() => setDescription("")}
              />
            )}
          </div>
          <button onClick={handleSearch}>Search</button>
          {selectedItems.length > 0 && (
            <button className="savebtn" onClick={handleSave}>
              Save
            </button>
          )}
          <button className="butpla" onClick={handleLoadPlagiarismDetector}>
            try on other way ...🚀
          </button>
        </div>
        <div className="right-section col-sm-12 col-lg-6 col-md-6">
          <div className="container">
            <div className="row">
              {loading ? (
                <div className="spinner-container">
                  <PulseLoader
                    color="#36d7b7"
                    size={14}
                    cssOverride={{
                      display: "block",
                      "margin-left": "240px",
                      "margin-right": "auto",
                    }}
                    loading={loading}
                  />
                </div>
              ) : searchPerformed &&
                googleResults.length === 0 &&
                youtubeResults.length === 0 ? (
                <p className="errormsg">Sorry buddy This Project not found</p>
              ) : (
                <>
                  <div className="col-lg-6 col-sm-12">
                    <h4>Google Results</h4>
                    <div className="search-section">
                      <div id="googleResults" className="search-results">
                        {googleResults.map((item, index) => (
                          <div key={index} className="result-item">
                            <input
                              type="checkbox"
                              className="result-checkbox"
                              onChange={(event) =>
                                handleCheckboxChange(event, item)
                              }
                            />
                            <div className="result-content">
                              <a href={item.link} target="_blank">
                                <h3>{item.title}</h3>
                                <p>{item.snippet}</p>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12">
                    <h4>Youtube Results</h4>
                    <div className="search-section">
                      <div id="youtubeResults" className="search-results">
                        {youtubeResults.map((item, index) => (
                          <div key={index}>
                            <input
                              type="checkbox"
                              onChange={(event) =>
                                handleCheckboxChange(event, item)
                              }
                            />
                            <a
                              href={`https://www.youtube.com/watch?v=${item.id.videoId}`}
                              target="_blank"
                            >
                              <img
                                src={item.snippet.thumbnails.default.url}
                                alt={item.snippet.title}
                              />
                              <p>{item.snippet.title}</p>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="clear"></div>
        </div>
      </div>
    </div>
  );
};

export default SearchTool;
