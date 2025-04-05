import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import axios from 'axios';

export default function Standings() {
  const { leagueId } = useParams(); // Extract the 'leagueId' parameter from the URL
  const [standings, setStandings] = useState([]); // State to store standings
  const [selectedLeagueId, setSelectedLeagueId] = useState(null); // State to store the league ID

  useEffect(() => {
    setSelectedLeagueId(leagueId); // Store the league ID in state.
  }, [leagueId]);

  useEffect(() => {
    if (selectedLeagueId) {
      const config = {
        method: 'get',
        url: `https://v3.football.api-sports.io/standings?league=${selectedLeagueId}&season=2023`,
        headers: {
          'x-rapidapi-key': '9ea5e5ef8d94d9a2d45e6c30b216d5fa',
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
      };

      axios(config)
        .then((response) => {
          console.log(response.data);
          const standingsData = response.data.response[0].league.standings[0];
          setStandings(standingsData); // Store standings data in state
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedLeagueId]);

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
                    style={{ width: '30px', marginRight: '10px' }}
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
    </div>
  );
}