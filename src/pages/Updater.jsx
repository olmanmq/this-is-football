import Layout from "../components/Layout";
import React, { useState } from "react";
import axios from "axios";
import JSZip from "jszip";

export default function Updater() {
  const [progress, setProgress] = useState(0); // State to track progress
  const [loading, setLoading] = useState(false); // State to track if fetching is running

  const fetchCountries = async () => {
    const config = {
      method: "get",
      url: "https://v3.football.api-sports.io/countries",
      headers: {
        "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
        "x-rapidapi-host": "v3.football.api-sports.io",
      },
    };

    try {
      setLoading(true); // Set loading to true
      const response = await axios(config);
      const countries = response.data.response;

      // Create a new JSZip instance
      const zip = new JSZip();

      // Add the countries data as a JSON file to the ZIP
      zip.file("countries.json", JSON.stringify(countries, null, 2));

      // Generate the ZIP file
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // Create a link to download the ZIP file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = "countries.zip";
      link.click();

      console.log("Countries data saved as countries.zip");
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const fetchTeams = async () => {
    const leaguesConfig = {
      method: "get",
      url: "https://v3.football.api-sports.io/leagues",
      headers: {
        "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
        "x-rapidapi-host": "v3.football.api-sports.io",
      },
    };

    try {
      setLoading(true); // Set loading to true
      // Step 1: Fetch all leagues
      const leaguesResponse = await axios(leaguesConfig);
      const leagues = leaguesResponse.data.response;

      // Step 2: Filter the 10 most popular leagues
      const popularLeagues = leagues
        .sort((a, b) => b.league.popularity - a.league.popularity) // Sort by popularity
        .slice(0, 10); // Take the top 10 leagues

      const allTeams = [];
      const totalLeagues = popularLeagues.length;

      // Step 3: Fetch teams for each league
      for (let i = 0; i < totalLeagues; i++) {
        const league = popularLeagues[i];
        const teamsConfig = {
          method: "get",
          url: `https://v3.football.api-sports.io/teams?league=${league.league.id}&season=2023`,
          headers: {
            "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
            "x-rapidapi-host": "v3.football.api-sports.io",
          },
        };

        const teamsResponse = await axios(teamsConfig);
        const teams = teamsResponse.data.response;

        // Add teams to the allTeams array
        allTeams.push(...teams);

        // Update progress
        setProgress(((i + 1) / totalLeagues) * 100);
      }

      // Step 4: Create a Blob with all teams data
      const blob = new Blob([JSON.stringify(allTeams, null, 2)], {
        type: "application/json",
      });

      // Step 5: Create a link to download the file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "popular_leagues_teams.json";
      link.click();

      console.log("Teams data saved as popular_leagues_teams.json");
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false); // Set loading to false
      setProgress(0); // Reset progress after completion
    }
  };

  const fetchTeamStatistics = async () => {
    const leaguesConfig = {
      method: "get",
      url: "https://v3.football.api-sports.io/leagues",
      headers: {
        "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
        "x-rapidapi-host": "v3.football.api-sports.io",
      },
    };

    try {
      setLoading(true); // Set loading to true

      // Step 1: Fetch all leagues
      const leaguesResponse = await axios(leaguesConfig);
      const leagues = leaguesResponse.data.response;

      // Step 2: Filter the 10 most popular leagues
      const popularLeagues = leagues
        .sort((a, b) => b.league.popularity - a.league.popularity) // Sort by popularity
        .slice(0, 10); // Take the top 10 leagues

      const allStatistics = [];

      // Step 3: Fetch statistics for each team in each league
      for (const league of popularLeagues) {
        const teamsConfig = {
          method: "get",
          url: `https://v3.football.api-sports.io/teams?league=${league.league.id}&season=2023`,
          headers: {
            "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
            "x-rapidapi-host": "v3.football.api-sports.io",
          },
        };

        const teamsResponse = await axios(teamsConfig);
        const teams = teamsResponse.data.response;

        for (const team of teams) {
          const statsConfig = {
            method: "get",
            url: `https://v3.football.api-sports.io/teams/statistics?team=${team.team.id}&league=${league.league.id}&season=2023`,
            headers: {
              "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
              "x-rapidapi-host": "v3.football.api-sports.io",
            },
          };

          const statsResponse = await axios(statsConfig);
          const statistics = statsResponse.data.response;

          // Add the statistics to the allStatistics array
          allStatistics.push({
            league: league.league.name,
            team: team.team.name,
            statistics,
          });
        }
      }

      // Step 4: Create a Blob with all statistics data
      const blob = new Blob([JSON.stringify(allStatistics, null, 2)], {
        type: "application/json",
      });

      // Step 5: Create a link to download the file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "team_statistics.json";
      link.click();

      console.log("Team statistics saved as team_statistics.json");
    } catch (error) {
      console.error("Error fetching team statistics:", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const fetchTeamSeasons = async () => {
    const leaguesConfig = {
      method: "get",
      url: "https://v3.football.api-sports.io/leagues",
      headers: {
        "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
        "x-rapidapi-host": "v3.football.api-sports.io",
      },
    };

    try {
      setLoading(true); // Set loading to true
      setProgress(0); // Reset progress

      // Step 1: Fetch all leagues
      const leaguesResponse = await axios(leaguesConfig);
      const leagues = leaguesResponse.data.response;

      // Step 2: Filter the 10 most popular leagues
      const popularLeagues = leagues
        .sort((a, b) => b.league.popularity - a.league.popularity) // Sort by popularity
        .slice(0, 10); // Take the top 10 leagues

      const allSeasons = [];
      const totalLeagues = popularLeagues.length;

      // Step 3: Fetch seasons for each team in each league
      for (let i = 0; i < totalLeagues; i++) {
        const league = popularLeagues[i];
        const teamsConfig = {
          method: "get",
          url: `https://v3.football.api-sports.io/teams?league=${league.league.id}&season=2023`,
          headers: {
            "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
            "x-rapidapi-host": "v3.football.api-sports.io",
          },
        };

        const teamsResponse = await axios(teamsConfig);
        const teams = teamsResponse.data.response;

        for (const team of teams) {
          const seasonsConfig = {
            method: "get",
            url: `https://v3.football.api-sports.io/teams/seasons?team=${team.team.id}`,
            headers: {
              "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
              "x-rapidapi-host": "v3.football.api-sports.io",
            },
          };

          try {
            const seasonsResponse = await axios(seasonsConfig);
            const seasons = seasonsResponse.data.response;

            // Add the seasons to the allSeasons array
            allSeasons.push({
              league: league.league.name,
              team: team.team.name,
              seasons,
            });
          } catch (error) {
            console.error(
              `Error fetching seasons for team ${team.team.name} in league ${league.league.name}:`,
              error
            );
          }
        }

        // Update progress after processing each league
        setProgress(((i + 1) / totalLeagues) * 100);
      }

      // Step 4: Create a Blob with all seasons data
      const blob = new Blob([JSON.stringify(allSeasons, null, 2)], {
        type: "application/json",
      });

      // Step 5: Create a link to download the file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "team_seasons.json";
      link.click();

      console.log("Team seasons saved as team_seasons.json");
    } catch (error) {
      console.error("Error fetching team seasons:", error);
    } finally {
      setLoading(false); // Set loading to false
      setProgress(0); // Reset progress
    }
  };

  return (
    <Layout>
      <div className="container text-center mt-5">
        <h1>Updater</h1>
        <p>Click the buttons below to fetch data and save them to JSON files.</p>
        <button
          className="btn btn-primary m-2"
          onClick={fetchCountries}
          style={{ padding: "10px 20px", fontSize: "16px" }}
          disabled={loading} // Disable button when loading
        >
          Fetch Countries (ZIP)
        </button>
        <button
          className="btn btn-secondary m-2"
          onClick={fetchTeams}
          style={{ padding: "10px 20px", fontSize: "16px" }}
          disabled={loading} // Disable button when loading
        >
          Fetch Teams
        </button>
        <button
          className="btn btn-primary m-2"
          onClick={fetchTeamStatistics}
          style={{ padding: "10px 20px", fontSize: "16px" }}
          disabled={loading} // Disable button when loading
        >
          Fetch Team Statistics
        </button>
        <button
          className="btn btn-primary m-2"
          onClick={fetchTeamSeasons}
          style={{ padding: "10px 20px", fontSize: "16px" }}
          disabled={loading} // Disable button when loading
        >
          Fetch Team Seasons
        </button>
        {progress > 0 && (
          <div className="mt-3">
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}