import React, { useEffect, useState } from 'react';
import axios from 'axios';



export default function Leagues() {
  const [leagues, setLeagues] = useState([])

  useEffect(() => {



      var config = {
        method: 'get',
        url: 'https://v3.football.api-sports.io/leagues',
        headers: {
          'x-rapidapi-key': '9ea5e5ef8d94d9a2d45e6c30b216d5fa',
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
      };
      
      axios(config)
      .then(function (response) {

        console.log(JSON.stringify(response.data.response));
        setLeagues(response.data.response)
        console.log(leagues)
      })
      .catch(function (error) {
        console.log(error);
      });







  }, []);

  return (
    <div>
      <h3>Top Leagues</h3>
      <ul>
        {leagues.map((league) => (
          <li key={league.league.id}>{league.league.name}</li>
        ))}
      </ul>
    </div>
  );
}