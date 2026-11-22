// src/pages/Leaderboard.jsx
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_SCORES } from "../graphql/queries";
import { Link } from "react-router-dom";

export default function Leaderboard() {
  const { data, loading, error } = useQuery(GET_SCORES);

  if (loading) return <div style={{padding:20}}>Loading leaderboard…</div>;
  if (error) return <div style={{padding:20}}>Error loading leaderboard.</div>;

  const scores = (data?.getScores || []).slice().sort((a,b)=> b.score - a.score);

  return (
    <div style={{ padding: "32px", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Leaderboard</h1>
        <Link to="/" style={{ textDecoration: "none" }}>← Back to Home</Link>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
            <th style={{ padding: "8px 12px" }}>Rank</th>
            <th style={{ padding: "8px 12px" }}>Player</th>
            <th style={{ padding: "8px 12px" }}>Score</th>
            <th style={{ padding: "8px 12px" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((s, i) => (
            <tr key={s.id || s._id} style={{ borderBottom: "1px solid #f4f4f4" }}>
              <td style={{ padding: "10px 12px", width: 70 }}>{i + 1}</td>
              <td style={{ padding: "10px 12px" }}>{s.player || "Anonymous"}</td>
              <td style={{ padding: "10px 12px" }}>{s.score}</td>
              <td style={{ padding: "10px 12px" }}>{new Date(s.date || s.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
