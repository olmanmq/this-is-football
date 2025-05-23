import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout"; // Import the Layout component
import axios from "axios";

export default function Players() {
  const { playerId, leagueId } = useParams(); // Extract playerId and leagueId from the URL

  const [playerStats, setPlayerStats] = useState(null); // State to store player statistics
  const [currentSeason, setCurrentSeason] = useState(null); // State to store the current season
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Fetch the current season for the league
  useEffect(() => {
    if (leagueId) {
      const config = {
        method: "get",
        url: `https://v3.football.api-sports.io/leagues?id=${leagueId}`, // Use leagueId from the URL
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

  // Fetch player statistics
  useEffect(() => {
    if (playerId && leagueId && currentSeason) {
      const config = {
        method: "get",
        url: `https://v3.football.api-sports.io/players?id=${playerId}&league=${leagueId}&season=${currentSeason}`, // Include leagueId and currentSeason
        headers: {
          "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
          "x-rapidapi-host": "v3.football.api-sports.io",
        },
      };

      axios(config)
        .then((response) => {
          console.log("Player Statistics API Response:", response.data); // Log the API response
          setPlayerStats(response.data.response[0]); // Store the player's statistics
        })
        .catch((error) => {
          console.error("Error fetching player statistics:", error);
        })
        .finally(() => {
          setLoading(false); // Set loading to false after the API call
        });
    }
  }, [playerId, leagueId, currentSeason]);

  return (
    <Layout>
      <div>
        {loading ? (
          <p>Loading player statistics...</p>
        ) : playerStats ? (
          <div>
            <h1>{playerStats.player.name}</h1>
            <img
              src={playerStats.player.photo}
              alt={playerStats.player.name}
              style={{ width: "100px", borderRadius: "50%" }}
            />
            <p><strong>Age:</strong> {playerStats.player.age}</p>
            <p><strong>Nationality:</strong> {playerStats.player.nationality}</p>

            <h2>Statistics</h2>
            {playerStats.statistics.map((stat, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <h3>Team: {stat.team.name}</h3>
                <p><strong>League:</strong> {stat.league.name}</p>
                <p><strong>Season:</strong> {stat.league.season}</p>
                <p><strong>Appearances:</strong> {stat.games.appearances || 0}</p>
                <p><strong>Minutes Played:</strong> {stat.games.minutes || 0}</p>
                <p><strong>Goals:</strong> {stat.goals.total || 0}</p>
                <p><strong>Assists:</strong> {stat.goals.assists || 0}</p>
                <p><strong>Yellow Cards:</strong> {stat.cards.yellow || 0}</p>
                <p><strong>Red Cards:</strong> {stat.cards.red || 0}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No player statistics found.</p>
        )}
      </div>
    </Layout>
  );
}