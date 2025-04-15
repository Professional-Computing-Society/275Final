import React, { useState } from 'react';
import { DetailedAssessment } from './components/DetailedAssessment';
import { BasicAssessment } from './components/BasicAssessment';
import { Route, Link, Routes, useLocation } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import './App.css';

// Chat GPT function
import { chat } from './chat';


// Local storage and API key setup
let keyData = "";
const saveKeyData = "MYKEY";
const prevKey = localStorage.getItem(saveKeyData);
if (prevKey !== null) {
  keyData = JSON.parse(prevKey);
}

function App() {
  const [key, setKey] = useState<string>(keyData);
  const location = useLocation();

  async function handleSubmit() {
    localStorage.setItem(saveKeyData, JSON.stringify(key));
  
    // try {
    //   const result = await chat("Say hello!");
    //   alert(result);
    // } catch (err) {
    //   console.error(err);
    //   alert("Failed to connect with the API. Please check your key.");
    // }
  }

  function changeKey(event: React.ChangeEvent<HTMLInputElement>) {
    setKey(event.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="fancy-title">Career-Helpi</h1>
        <div className="divider" />

        {/* Back/Home navigation when inside an assessment */}
        {location.pathname.includes("assessment") && (
          <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "10px" }}>
            <Link to="/">
              <button className="cool-button">Back to Home</button>
            </Link>
            {location.pathname === "/basic-assessment" && (
              <Link to="/detailed-assessment">
                <button className="cool-button">Go to Detailed</button>
              </Link>
            )}
            {location.pathname === "/detailed-assessment" && (
              <Link to="/basic-assessment">
                <button className="cool-button">Go to Basic</button>
              </Link>
            )}
          </div>
        )}

        {!location.pathname.includes("assessment") && (
          <>
            <div className="homepage-summary">
              <p>
                Discover your future! Use our tools to explore career paths that align with your skills, preferences, and passions.
              </p>
            </div>

            <div className="homepage-layout">
              <div className="assessment-button">
                <Link to="/basic-assessment">
                  <button className="cool-button">
                    Basic Career Assessment
                  </button>
                </Link>
                <p className="description-box">
                  This Basic career assessment helps identify your work style and problem-solving preferences to guide you toward general career paths that fit your personality.
                </p>
              </div>

              <div className="assessment-button">
                <Link to="/detailed-assessment">
                  <button className="cool-button">
                    Detailed Career Assessment
                  </button>
                </Link>
                <p className="description-box">
                  This detailed career assessment explores your motivations, decision-making, and values to help identify careers that match your long-term goals.
                </p>
              </div>
            </div>
          </>
        )}

        <Routes>
          <Route path="/basic-assessment" element={<BasicAssessment />} />
          <Route path="/detailed-assessment" element={<DetailedAssessment />} />
        </Routes>
      </header>

      <Form>
        <Form.Label>API Key:</Form.Label>
        <Form.Control type="password" placeholder="Insert API Key Here" onChange={changeKey} />
        <br />
        <Button className="Submit-Button" onClick={handleSubmit}>Submit</Button>
      </Form>

      <p style={{ fontSize: "0.8rem", color: "#ccc", marginTop: "10px" }}>
        Your API key is stored only in your browser and never shared. If the assessments aren't working, double-check your key.
      </p>
    </div>
  );
}

export default App;
