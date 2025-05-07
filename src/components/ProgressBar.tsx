import React from "react";

interface ProgressBarProps {
    current: number;
    total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps): React.JSX.Element {
    const percent = Math.round((current / total) * 100);

    return (
        <div style={{ width: "100%", marginBottom: "15px" }}>
            <div
                style={{
                    height: "20px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "10px",
                    overflow: "hidden"
                }}
            >
                <div
                    style={{
                        width: `${percent}%`,
                        height: "100%",
                        backgroundColor: "#4caf50",
                        transition: "width 0.3s ease",
                    }}
                />
            </div>
            <p style={{ fontSize: "0.9rem", marginTop: "5px", color: "black" }}>
                {current} of {total} questions answered
            </p>
        </div>
    );
}
