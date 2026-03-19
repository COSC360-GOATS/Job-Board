import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  //added 2 new states for milestone 2
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:3000/jobs/search?q=${query}`);
    const data = await response.json();
    setResults(data); //saves the jobs returned from the server
    setSearched(true); //marks a search happened
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for jobs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

    {/* Milestone 2 */}
    {searched && results.length === 0 && (
        <p>No results found.</p>
      )}

    {results.map((job) => (
        <div key={job.id} className="job-card">
          <h3>{job.title}</h3>
          <p>{job.company} — {job.location}</p>
          <p>{job.salary}</p>
        </div>
      ))}
    </div>
  );
}
