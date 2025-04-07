import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component"; // Import DataTable
import Layout from "../components/Layout"; // Import the Layout component

export default function Standings() {
  const { leagueId } = useParams(); // Extract the 'leagueId' parameter from the URL
  const [standings, setStandings] = useState([]); // State to store standings
  const [topPlayers, setTopPlayers] = useState([]); // State to store top players' statistics
  const [selectedLeagueId, setSelectedLeagueId] = useState(null); // State to store the league ID

  // Get the last season dynamically
  const lastSeason = new Date().getFullYear() - 1;

  useEffect(() => {
    setSelectedLeagueId(leagueId); // Store the league ID in state
  }, [leagueId]);

  // Fetch standings for the last season
  useEffect(() => {
    if (selectedLeagueId) {
      const config = {
        method: "get",
        url: `https://v3.football.api-sports.io/standings?league=${selectedLeagueId}&season=${lastSeason}`,
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
  }, [selectedLeagueId, lastSeason]);

  // Fetch top players' statistics for the last season
  useEffect(() => {
    if (selectedLeagueId) {
      const config = {
        method: "get",
        url: `https://v3.football.api-sports.io/players?league=${selectedLeagueId}&season=${lastSeason}`,
        headers: {
          "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
          "x-rapidapi-host": "v3.football.api-sports.io",
        },
      };

      axios(config)
        .then((response) => {
          console.log("Players API Response:", response.data); // Log the API response
          const playersData = response.data.response.map((player) => ({
            name: player.player.name,
            team: player.statistics[0]?.team?.name ?? "Unknown Team",
            goals: player.statistics[0]?.goals?.total ?? 0,
            assists: player.statistics[0]?.goals?.assists ?? 0,
            appearances: player.statistics[0]?.games?.appearances ?? 0,
          }));

          // Sort players by goals scored and take the top 10
          const topPlayersData = playersData
            .sort((a, b) => b.goals - a.goals) // Sort by goals in descending order
            .slice(0, 10); // Take the top 10 players

          setTopPlayers(topPlayersData); // Store top players' statistics in state
        })
        .catch((error) => {
          console.error("Error fetching players' statistics:", error);
        });
    }
  }, [selectedLeagueId, lastSeason]);

  // Fetch players for all teams in the standings
  const fetchPlayersForAllTeams = async () => {
    const teams = standings.map((team) => team.team.id); // Get all team IDs from standings
    const allPlayers = [];

    for (const teamId of teams) {
      const config = {
        method: "get",
        url: `https://v3.football.api-sports.io/players?team=${teamId}&season=${lastSeason}`,
        headers: {
          "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
          "x-rapidapi-host": "v3.football.api-sports.io",
        },
      };

      try {
        const response = await axios(config);
        const playersData = response.data.response.map((player) => ({
          name: player.player.name,
          team: player.statistics[0]?.team?.name ?? "Unknown Team",
          goals: player.statistics[0]?.goals?.total ?? 0,
          assists: player.statistics[0]?.goals?.assists ?? 0,
          appearances: player.statistics[0]?.games?.appearances ?? 0,
        }));
        allPlayers.push(...playersData);
      } catch (error) {
        console.error(`Error fetching players for team ${teamId}:`, error);
      }
    }

    // Sort all players by goals scored and take the top 10
    const topPlayersData = allPlayers
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10);

    setTopPlayers(topPlayersData); // Store top players' statistics in state
  };

  useEffect(() => {
    if (selectedLeagueId && standings.length > 0) {
      fetchPlayersForAllTeams(); // Fetch players for all teams in the league
    }
  }, [selectedLeagueId, standings, lastSeason]);

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

  // Define columns for the top players' statistics DataTable
  const topPlayersColumns = [
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
        <h3>Standings (Last Season: {lastSeason})</h3>
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

        {/* Top Players' Statistics Section */}
        <h3 className="mt-5">Top Players' Statistics (Last Season: {lastSeason})</h3>
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
          <p>Loading top players' statistics...</p>
        )}
      </div>
    </Layout>
  );
}