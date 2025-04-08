import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component"; // Import DataTable
import Layout from "../components/Layout"; // Import the Layout component

export default function Standings() {
  const { leagueId } = useParams(); // Extract the 'leagueId' parameter from the URL
  const [standings, setStandings] = useState([]); // State to store standings
  const [currentSeason, setCurrentSeason] = useState(null); // State to store the current season
  const [topPlayers, setTopPlayers] = useState([]); // State to store top players

  // Fetch the current season for the league
  useEffect(() => {
    if (leagueId) {
      const config = {
        method: "get",
        url: `https://v3.football.api-sports.io/leagues?id=${leagueId}`,
        headers: {
          "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
          "x-rapidapi-host": "v3.football.api-sports.io",
        },
      };

      axios(config)
        .then((response) => {
          const leagueData = response.data.response[0];
          const currentSeasonData = leagueData.seasons.find(
            (season) => season.current === true
          );
          setCurrentSeason(currentSeasonData.year); // Store the current season year
        })
        .catch((error) => {
          console.error("Error fetching current season:", error);
        });
    }
  }, [leagueId]);

  // Fetch standings for the current season
  useEffect(() => {
    if (leagueId && currentSeason) {
      const config = {
        method: "get",
        url: `https://v3.football.api-sports.io/standings?league=${leagueId}&season=${currentSeason}`,
        headers: {
          "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
          "x-rapidapi-host": "v3.football.api-sports.io",
        },
      };

      axios(config)
        .then((response) => {
          const standingsData = response.data.response[0].league.standings[0];
          setStandings(standingsData); // Store standings data in state
        })
        .catch((error) => {
          console.error("Error fetching standings:", error);
        });
    }
  }, [leagueId, currentSeason]);

  // Fetch top players for the current league and season
  useEffect(() => {
    if (leagueId && currentSeason) {
      const config = {
        method: "get",
        url: `https://v3.football.api-sports.io/players/topscorers?league=${leagueId}&season=${currentSeason}`,
        headers: {
          "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
          "x-rapidapi-host": "v3.football.api-sports.io",
        },
      };

      axios(config)
        .then((response) => {
          console.log("Top Players API Response:", response.data); // Log the API response
          const playersData = response.data.response.map((player) => ({
            name: player.player.name,
            photo: player.player.photo, // Include the player's photo
            team: player.statistics[0]?.team?.name ?? "Unknown Team",
            goals: player.statistics[0]?.goals?.total ?? 0,
            assists: player.statistics[0]?.goals?.assists ?? 0,
            appearances: player.statistics[0]?.games?.appearences ?? 0,
          }));
          console.log("Players data:", playersData); // Log the processed players data
          setTopPlayers(playersData); // Store top players in state
        })
        .catch((error) => {
          console.error("Error fetching top players:", error);
        });
    }
  }, [leagueId, currentSeason]);

  // Define columns for the standings DataTable
  const standingsColumns = [
    {
      name: "Position",
      selector: (row) => row.rank,
      sortable: true,
    },
    {
      name: "Team",
      selector: (row) => (
        <div className="d-flex align-items-center">
          <img
            src={row.team.logo}
            alt={row.team.name}
            style={{ width: "30px", marginRight: "10px" }}
          />
          {row.team.name}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Points",
      selector: (row) => row.points,
      sortable: true,
    },
  ];

  // Define columns for the top players DataTable
  const topPlayersColumns = [
    {
      name: "Photo",
      selector: (row) => (
        <img
          src={row.photo}
          alt={row.name}
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
      ),
      sortable: false,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Team",
      selector: (row) => row.team,
      sortable: true,
    },
    {
      name: "Goals",
      selector: (row) => row.goals,
      sortable: true,
    },
    {
      name: "Assists",
      selector: (row) => row.assists,
      sortable: true,
    },
    {
      name: "Appearances",
      selector: (row) => row.appearances,
      sortable: true,
    },
  ];

  return (
    <Layout>
      <div>
        {/* Standings Section */}
        <h3>Standings (Season: {currentSeason || "Loading..."})</h3>
        {standings.length > 0 ? (
          <DataTable
            columns={standingsColumns}
            data={standings}
            highlightOnHover
            responsive
            striped
            pagination={false} // Disable pagination
          />
        ) : (
          <p>Loading standings...</p>
        )}

        {/* Top Players Section */}
        <h3 className="mt-5">Top Players (Season: {currentSeason || "Loading..."})</h3>
        {topPlayers.length > 0 ? (
          <DataTable
            columns={topPlayersColumns}
            data={topPlayers}
            highlightOnHover
            responsive
            striped
            pagination={false} // Disable pagination
          />
        ) : (
          <p>Loading top players...</p>
        )}
      </div>
    </Layout>
  );
}