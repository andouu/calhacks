"use client";
import { useState } from "react";
import styles from "./page.module.scss";
import { FaMicrophone, FaRegStopCircle } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

export default function Countdown() {
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [recording, setRecording] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

  return (
    <div className={styles.wrapper}>
      <span className={styles.question}>1 + 6 = ?</span>
      <span
        className={styles.response}
        style={{ color: !response || !recording ? "gray" : undefined }}
      >
        {recording
          ? response
            ? response
            : "Recording response"
          : "Turn on microphone to respond"}
      </span>
      <span className={styles.timeText}>
        {secondsLeft} {secondsLeft === 1 ? "Second" : "Seconds"} Left!
      </span>
      <div className={styles.timer}>
        <div
          className={styles.inner}
          style={{ width: `${(secondsLeft / 30) * 100}%` }}
        />
      </div>
      <div className={styles.actionRow}>
        <button
          style={{ backgroundColor: recording ? "#FA5454" : "#222222" }}
          onClick={() => setRecording((prev) => !prev)}
        >
          {recording ? (
            <>
              <FaRegStopCircle size="2rem" />
              Stop Recording
            </>
          ) : (
            <>
              <FaMicrophone size="2rem" />
              Turn Mic On!
            </>
          )}
        </button>
        <button style={{ backgroundColor: "#FA5454" }}>
          <FaX /> Give Up
        </button>
      </div>
    </div>
  );
}
