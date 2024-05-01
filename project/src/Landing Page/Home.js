import React from 'react';
import SwiperContainer from './SwiperContainer';
import './App.css'; // Ensure this path is correct for your CSS

const Home = ({ openModal }) => {
  return (
    <>
      <video autoPlay muted loop className="body-video">
        <source src="/bg.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      <SwiperContainer openModal={openModal} />
      <div className="about-us-box">About Us</div>
      <div className="container">
        <div className="content">
          <div className="content-text-box">
            <h1>Cyber Security Prevention</h1>
            <p>
              Welcome to our Cyber Security prevention website in a digital world teeming with potential threats,
              we're your shield and guide.
              <br />
              <h5>Our mission is simple: Your online safety.</h5>
              <br />
              Explore, Discover, Secure:
              <br /><br />
              Uncover the intricate web of data networks.
              <br /><br />
              Detect and stop threats before they strike.
              <br /><br />
              Stay ahead with proactive prevention.
              <br /><br />
              Expert insights for modern security.
              <br /><br />
              We're here for everyone, from individuals to businesses, ensuring your digital world stays secure. Dive in,
              explore our tools, and trust us with your cybersecurity journey.
              <br /><br />
              Thank you for choosing us as your digital guardian.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
