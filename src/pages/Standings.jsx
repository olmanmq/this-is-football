import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";

export default function Standings() {
  const { leagueId } = useParams(); // Extract the 'leagueId' parameter from the URL
  const [standings, setStandings] = useState([]); // State to store standings
  const [stats, setStats] = useState([]); // State to store league stats
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [selectedLeagueId, setSelectedLeagueId] = useState(null); // State to store the league ID

  useEffect(() => {
    setSelectedLeagueId(leagueId); // Store the league ID in state
  }, [leagueId]);

  useEffect(() => {
    if (selectedLeagueId) {
      const config = {
        method: "get",
        url: `https://v3.football.api-sports.io/standings?league=${selectedLeagueId}&season=2023`,
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
          console.error(error);
        });
    }
  }, [selectedLeagueId]);

  // Fetch league stats
  useEffect(() => {
    if (selectedLeagueId) {
      const config = {
        method: "get",
        url: `https://v3.football.api-sports.io/teams/statistics?league=${selectedLeagueId}&season=2023`,
        headers: {
          "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
          "x-rapidapi-host": "v3.football.api-sports.io",
        },
      };

      axios(config)
        .then((response) => {
          const statsData = response.data.response;
          setStats(statsData); // Store stats data in state
          setLoading(false); // Set loading to false
        })
        .catch((error) => {
          console.error(error);
          setLoading(false); // Set loading to false even if there's an error
        });
    }
  }, [selectedLeagueId]);

  // Define columns for the stats table
  const statsColumns = [
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
      name: "Played",
      selector: (row) => row.played,
      sortable: true,
    },
    {
      name: "Wins",
      selector: (row) => row.wins,
      sortable: true,
    },
    {
      name: "Losses",
      selector: (row) => row.losses,
      sortable: true,
    },
    {
      name: "Goals",
      selector: (row) => row.goals,
      sortable: true,
    },
  ];

  return (
    <div>
      <h3>Standings</h3>
      {standings.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Team</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team) => (
              <tr key={team.team.id}>
                <td>{team.rank}</td>
                <td>
                  <img
                    src={team.team.logo}
                    alt={team.team.name}
                    style={{ width: "30px", marginRight: "10px" }}
                  />
                  {team.team.name}
                </td>
                <td>{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading standings...</p>
      )}
      <h3>League Stats</h3>
      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <DataTable
          columns={statsColumns}
          data={stats}
          pagination
          highlightOnHover
        />
      )}
    </div>
  );
}