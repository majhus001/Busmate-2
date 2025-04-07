import React from 'react';
import './About.css';

const About = () => {
    return (
        <section id="about" className="about-section">
            <div className="about-container">
                <div className="about-images">
                    <img src="https://img.freepik.com/free-photo/cartoon-character-school-bus-with-happy-expression-3d-illustration_1057-45468.jpg" alt="Bus Illustration" />
                    <img src="https://img.freepik.com/premium-photo/detailed-3d-boy-sculpture-excited-bus-game-character-tpose_899449-336269.jpg" alt="Happy Passenger" />
                    <img src="https://img.freepik.com/premium-photo/happy-children-subway-train-car-illustration_1036975-35655.jpg" alt="Travel Scene" />
                    <img src="https://static.vecteezy.com/system/resources/thumbnails/027/309/183/small_2x/driver-with-ai-generated-free-png.png" alt="Bus Driver" />
                </div>

                <div className="about-content">
                    <h2>About <span>BusMate</span></h2>
                    <p>
                        BusMate is a smart and reliable travel companion for daily commuters. 
                        We provide real-time seat availability, live tracking, and multiple payment options, 
                        ensuring a smooth and stress-free travel experience. Whether you're a passenger or a conductor, 
                        BusMate simplifies the journey for everyone.
                    </p>
                    <button className="about-btn">Explore Features →</button>
                </div>
            </div>
        </section>
    );
};

export default About;
