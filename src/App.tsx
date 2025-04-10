import React, { useState } from 'react';
import { DetailedAssessment } from './components/DetailedAssessment';
import './App.css';
import { Button, Form } from 'react-bootstrap';
import { Route, Link, Routes, useLocation } from 'react-router-dom';
import { BasicAssessment } from './components/BasicAssessment';

// local storage and API Key code remains the same
let keyData = "";
const saveKeyData = "MYKEY";
const prevKey = localStorage.getItem(saveKeyData);
if (prevKey !== null) {
  keyData = JSON.parse(prevKey);
}

function App() {
  const [key, setKey] = useState<string>(keyData); //for api key input
  const location = useLocation();
  
  function handleSubmit() {
    localStorage.setItem(saveKeyData, JSON.stringify(key));
    window.location.reload();
  }

  function changeKey(event: React.ChangeEvent<HTMLInputElement>) {
    setKey(event.target.value);
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>CISC275 Career Assessment</h1>
        {/* Add back to home button when on assessment routes */}
        {location.pathname.includes("assessment") && (
        <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "10px" }}>
          <Link to="/">
            <button className="cool-button">
              Back to Home
            </button>
          </Link>
          {location.pathname === "/basic-assessment" && (
            <Link to="/detailed-assessment">
              <button className="cool-button">
                Go to Detailed
              </button>
            </Link>
          )}
          {location.pathname === "/detailed-assessment" && (
            <Link to="/basic-assessment">
              <button className="cool-button">
                Go to Basic
              </button>
            </Link>
          )}
        </div>
      )}
        {!location.pathname.includes("assessment") && (
          <>
            <Link to="/basic-assessment">
              <button className="cool-button">Basic Career Assessment</button>
            </Link>
            <p style={{fontSize: "0.9rem", border:"2px solid #ccc", borderRadius: "20px",maxWidth: "600px", marginTop: "10px"}}>
              This Basic career assessment is meant to help identify your work style and problem-solving preferences to guide you toward general career paths that fit your personality. 
            </p>
            <Link to="/detailed-assessment">
              <button className="cool-button">Detailed Career Assessment</button>
            </Link>
            <p style={{fontSize: "0.9rem", border:"2px solid #ccc", borderRadius: "20px",maxWidth: "600px", marginTop: "10px"}}>
              This detailed career assessment is meant to explore your preferneces, motivations, and decision-making style to help identify the right careers that align with your strengths and interests.
            </p>
          </>
        )}
        <Routes>
          <Route path="/basic-assessment" element={<BasicAssessment />} />
          <Route path="/detailed-assessment" element={<DetailedAssessment />} />
        </Routes>
      </header>
      <Form>
        <Form.Label>API Key:</Form.Label>
        <Form.Control type="password" placeholder="Insert API Key Here" onChange={changeKey}></Form.Control>
        <br></br>
        <Button className="Submit-Button" onClick={handleSubmit}>Submit</Button>
      </Form>
      <p style={{ fontSize: "0.8rem", color: "#ccc", marginTop: "10px" }}>
  Your API key is stored only in your browser and never shared. If the assessments aren't working, double-check your key.
    </p>
    </div>
  );
}

export default App;