import React from "react";
import Layout from "../components/Layout";

// Import league logos
import premierLeagueLogo from "../assets/images/premier-league.png";
import laLigaLogo from "../assets/images/la-liga.png";
import serieALogo from "../assets/images/serie-a.png";
import bundesligaLogo from "../assets/images/bundesliga.png";
import ligue1Logo from "../assets/images/ligue-1.png";

export default function HomePage() {
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
    </Layout>
  );
}