import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DataTable from "react-data-table-component";
import axios from "axios";

export default function RankingFifa() {
  const [rankings, setRankings] = useState([]); // State to store FIFA rankings
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    // Fetch FIFA rankings from a free API
    const fetchRankings = async () => {
      try {
        const response = await axios.get("https://api-football-v1.p.rapidapi.com/v3/rankings", {
          headers: {
            "x-rapidapi-key": "9ea5e5ef8d94d9a2d45e6c30b216d5fa",
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
          },
        });

        // Map the response data to extract relevant fields
        const rankingsData = response.data.response.map((team) => ({
          rank: team.rank,
          country: team.country,
          points: team.points,
          previousRank: team.previous_rank,
        }));

        setRankings(rankingsData); // Store rankings in state
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error("Error fetching FIFA rankings:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchRankings();
  }, []);

  // Define columns for the DataTable
  const columns = [
    {
      name: "Rank",
      selector: (row) => row.rank,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) => row.country,
      sortable: true,
    },
    {
      name: "Points",
      selector: (row) => row.points,
      sortable: true,
    },
    {
      name: "Previous Rank",
      selector: (row) => row.previousRank,
      sortable: true,
    },
  ];

  return (
    <Layout>
      <div>
        <h3>FIFA Rankings</h3>
        {loading ? (
          <p>Loading FIFA rankings...</p>
        ) : (
          <DataTable
            columns={columns}
            data={rankings}
            pagination
            highlightOnHover
            responsive
            striped
            theme="default"
          />
        )}
      </div>
    </Layout>
  );
}