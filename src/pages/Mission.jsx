import React from "react";
import Layout from "../components/Layout"; // Import the Layout component

const Mission = () => {
  return (
    <Layout>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center">Our Mission</h1>
            <p className="mt-4">
              At Football Vite, our mission is to bring football enthusiasts closer to the game they love. 
              We aim to provide accurate and up-to-date information about leagues, teams, and players from around the world.
            </p>
            <p>
              Whether you're a casual fan or a die-hard supporter, we strive to create a platform that celebrates the passion, 
              excitement, and community of football.
            </p>
            <p>
              Join us in exploring the beautiful game and staying connected with the latest updates and stories.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Mission;