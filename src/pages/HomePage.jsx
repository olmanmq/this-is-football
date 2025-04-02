import Layout from "../components/Layout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

// Import league logos
import premierLeagueLogo from "../assets/images/premier-league.png";
import laLigaLogo from "../assets/images/la-liga.png";
import serieALogo from "../assets/images/serie-a.png";
import bundesligaLogo from "../assets/images/bundesliga.png";
import ligue1Logo from "../assets/images/ligue-1.png";

export default function HomePage() {
  const [leagues, setLeagues] = useState([]);
  const [filteredLeagues, setFilteredLeagues] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const config = {
      method: "get",
      url: "https://v3.football.api-sports.io/leagues",
      headers: {
        "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
        "x-rapidapi-host": "v3.football.api-sports.io",
      },
    };

    axios(config)
      .then((response) => {
        const leaguesData = response.data.response.map((league) => ({
          id: league.league.id,
          name: league.league.name,
          country: league.country.name,
          logo: league.league.logo,
        }));
        setLeagues(leaguesData);
        setFilteredLeagues(leaguesData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const results = leagues.filter(
      (league) =>
        league.name.toLowerCase().includes(search.toLowerCase()) ||
        league.country.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredLeagues(results);
  }, [search, leagues]);

  const columns = [
    {
      name: "Logo",
      selector: (row) => (
        <img src={row.logo} alt={row.name} style={{ width: "50px" }} />
      ),
      sortable: false,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) => row.country,
      sortable: true,
    },
  ];

  return (
    <Layout>
      <h1>THIS IS FOOTBALL</h1>
      <h3>Top 5 Football Leagues</h3>
      <div className="d-flex justify-content-around align-items-center flex-wrap mt-4">
        {/* Premier League */}
        <div className="text-center">
          <img
            src={premierLeagueLogo}
            alt="Premier League"
            style={{ maxWidth: "100px", height: "auto" }} // Proportional size
          />
          <p>Premier League</p>
        </div>

        {/* La Liga */}
        <div className="text-center">
          <img
            src={laLigaLogo}
            alt="La Liga"
            style={{ maxWidth: "100px", height: "auto" }} // Proportional size
          />
          <p>La Liga</p>
        </div>

        {/* Serie A */}
        <div className="text-center">
          <img
            src={serieALogo}
            alt="Serie A"
            style={{ maxWidth: "100px", height: "auto" }} // Proportional size
          />
          <p>Serie A</p>
        </div>

        {/* Bundesliga */}
        <div className="text-center">
          <img
            src={bundesligaLogo}
            alt="Bundesliga"
            style={{ maxWidth: "100px", height: "auto" }} // Proportional size
          />
          <p>Bundesliga</p>
        </div>

        {/* Ligue 1 */}
        <div className="text-center">
          <img
            src={ligue1Logo}
            alt="Ligue 1"
            style={{ maxWidth: "100px", height: "auto" }} // Proportional size
          />
          <p>Ligue 1</p>
        </div>
      </div>

      {/* Search Field */}
      <div className="mt-5">
        <h3>All Leagues</h3>
        <input
          type="text"
          placeholder="Search leagues..."
          className="form-control mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredLeagues}
          pagination
          highlightOnHover
          responsive
        />
      </div>
    </Layout>
  );
}