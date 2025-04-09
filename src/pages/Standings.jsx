import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import DataTable from "react-data-table-component"; // Import DataTable
import Layout from "../components/Layout"; // Import the Layout component

export default function Standings() {
  const { leagueId } = useParams(); // Extract the 'leagueId' parameter from the URL
  const navigate = useNavigate(); // Initialize useNavigate
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
            id: player.player.id, // Include the player's ID
            name: player.player.name,
            photo: player.player.photo, // Include the player's photo
            team: player.statistics[0]?.team?.name ?? "Unknown Team",
            goals: player.statistics[0]?.goals?.total ?? 0,
            assists: player.statistics[0]?.goals?.assists ?? 0,
            appearances: player.statistics[0]?.games?.appearences ?? 0,
            fullStatistics: player.statistics, // Include full statistics
          }));
          setTopPlayers(playersData); // Store top players in state
        })
        .catch((error) => {
          console.error("Error fetching top players:", error);
        });
    }
  }, [leagueId, currentSeason]);

  // Fetch team story from Wikipedia
  const fetchTeamStory = async (teamName) => {
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(teamName)}`
      );

      // Check if the response is a disambiguation page
      if (response.data.type === "disambiguation") {
        console.warn(`Disambiguation page found for ${teamName}. Attempting to resolve...`);

        // Retry with "football club" appended to the team name
        const retryResponse = await axios.get(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(teamName + " football club")}`
        );

        // Return the retry response if successful
        if (retryResponse.data.extract) {
          return retryResponse.data.extract;
        }

        // Attempt to fetch the first relevant link from the disambiguation page
        if (response.data.content_urls?.desktop?.page) {
          const disambiguationPageUrl = response.data.content_urls.desktop.page;

          // Fetch the disambiguation page HTML to extract links
          const disambiguationResponse = await axios.get(disambiguationPageUrl);
          const parser = new DOMParser();
          const doc = parser.parseFromString(disambiguationResponse.data, "text/html");

          // Extract the first link from the disambiguation page
          const firstLink = doc.querySelector("a[href^='/wiki/']");
          if (firstLink) {
            const correctArticleTitle = firstLink.getAttribute("href").replace("/wiki/", "");
            const correctArticleResponse = await axios.get(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(correctArticleTitle)}`
            );
            return correctArticleResponse.data.extract || "No story available.";
          }
        }

        return "Disambiguation page found, but no relevant article could be resolved.";
      }

      // Return the summary if it's not a disambiguation page
      return response.data.extract || "No story available.";
    } catch (error) {
      console.error(`Error fetching story for ${teamName}:`, error);
      return "No story available.";
    }
  };

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

  // Expandable row content for players
  const ExpandablePlayerRow = ({ data }) => {
    return (
      <div style={{ padding: "10px", backgroundColor: "#f9f9f9" }}>
        <h4>{data.name}</h4>
        {data.fullStatistics.map((stat, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <p><strong>Team:</strong> {stat.team.name}</p>
            <p><strong>League:</strong> {stat.league.name}</p>
            <p><strong>Season:</strong> {stat.league.season}</p>
            <p><strong>Appearances:</strong> {stat.games.appearences || 0}</p>
            <p><strong>Minutes Played:</strong> {stat.games.minutes || 0}</p>
            <p><strong>Goals:</strong> {stat.goals.total || 0}</p>
            <p><strong>Assists:</strong> {stat.goals.assists || 0}</p>
            <p><strong>Yellow Cards:</strong> {stat.cards.yellow || 0}</p>
            <p><strong>Red Cards:</strong> {stat.cards.red || 0}</p>
          </div>
        ))}
      </div>
    );
  };

  // Expandable row content
  const ExpandableRow = ({ data }) => {
    const [story, setStory] = useState("Loading...");

    useEffect(() => {
      const fetchStory = async () => {
        const teamStory = await fetchTeamStory(data.team.name);
        setStory(teamStory);
      };
      fetchStory();
    }, [data.team.name]);

    return (
      <div style={{ padding: "10px", backgroundColor: "#f9f9f9" }}>
        <h4>{data.team.name} Story</h4>
        <p>{story}</p>
      </div>
    );
  };

  // Conditional row styling for relegated teams
  const conditionalRowStyles = [
    {
      when: (row) => row.rank > 17, // Assuming ranks greater than 17 are relegated
      style: {
        backgroundColor: "#ffcccc", // Light red background
        color: "#ff0000", // Red text
      },
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
            conditionalRowStyles={conditionalRowStyles} // Apply conditional row styles
            expandableRows // Enable expandable rows
            expandableRowsComponent={ExpandableRow} // Component for expanded content
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
            expandableRows // Enable expandable rows
            expandableRowsComponent={ExpandablePlayerRow} // Component for expanded content
          />
        ) : (
          <p>Loading top players...</p>
        )}
      </div>
    </Layout>
  );
}