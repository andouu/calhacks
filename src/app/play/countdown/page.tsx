"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { FaMicrophone, FaPlay, FaRegStopCircle } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { UnstyledLink } from "@/app/Components/UnstyledLink";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";

const Help = ({ startGame }: { startGame: () => void }) => {
  return (
    <motion.div className={styles.wrapper} exit={{ opacity: 0 }}>
      <motion.span
        className={styles.title}
        initial={{ scale: 0, opacity: 0, filter: "blur(5px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{
          duration: 0.15,
          type: "spring",
          stiffness: 120,
          damping: 15,
        }}
      >
        How To Play
      </motion.span>
      <div className={styles.cards}>
        <motion.div
          className={styles.card}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <img src="/equation.svg" />
          <p>
            In this game mode, you will be given a series of math problems.
            You&apos;ll answer by speaking.
          </p>
        </motion.div>
        <motion.div
          className={styles.card}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <img src="/hearts.svg" />
          <p>You have 3 lives, which you lose by not answering in time.</p>
        </motion.div>
        <motion.div
          className={styles.card}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          <img src="/difficulty.png" />
          <p>
            The game gets harder as you progress. Get as high of a score as you
            can!
          </p>
        </motion.div>
      </div>
      <motion.button
        className={styles.play}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={startGame}
      >
        Let&apos;s Play!
      </motion.button>
    </motion.div>
  );
};

interface AnswerProps {
  question: string;
  answer: string;
  correct: boolean;
  prevPoints: number;
  currPoints: number;
  continueGame: () => void;
}

const Answer = ({
  question,
  answer,
  correct,
  prevPoints,
  currPoints,
  continueGame,
}: AnswerProps) => {
  const pointCounter = useMotionValue(prevPoints);
  const roundedPoints = useTransform(
    pointCounter,
    (value) => Math.round(value) + " pts"
  );

  useEffect(() => {
    const controls = animate(pointCounter, currPoints, {
      delay: 1,
      duration: 1,
      ease: "circInOut",
    });

    return controls.stop;
  }, []);

  return (
    <motion.div
      className={styles.answerWrapper}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 15,
      }}
    >
      <span className={styles.title}>The answer was...</span>
      <div className={styles.answer}>
        <span className={styles.answerText}>{answer}</span>
        <button className={styles.play}>
          <FaPlay />
        </button>
      </div>
      <div className={styles.yourAnswer}>
        <span>Your Answer</span>
        <button>
          <FaPlay size="1rem" />
        </button>
      </div>
      <motion.span className={styles.pointCounter}>{roundedPoints}</motion.span>
      <button className={styles.continue} onClick={continueGame}>
        Continue
      </button>
      <motion.div
        className={styles.ballWrapper}
        initial={{ x: "100%", y: "120vh", rotate: -90 }}
        animate={{
          x: "50%",
          y: "55vh",
          rotate: -35,
        }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 15 }}
      >
        <div className={styles.ball}>
          <img
            className={styles.face}
            src={correct ? "/face.svg" : "/face_frown.svg"}
          />
        </div>
        <motion.span
          className={styles.dialog}
          initial={{ x: "-50%", y: 0, opacity: 0 }}
          animate={{ y: -150, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {correct ? "Yay!! Correct Answer!" : "Aww... Wrong Answer"}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

const Game = () => {
  const [lives, setLives] = useState<number>(3);
  const [question, setQuestion] = useState<string>("1 + 6 = ?");
  const [answer, setAnswer] = useState<string>("siete");
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [recording, setRecording] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [prevPoints, setPrevPoints] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [correct, setCorrect] = useState<boolean>(false);
  const [showingAnswer, setShowingAnswer] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (secondsLeft === 0) {
        if (lives === 1) {
          setGameEnded(true);
          clearInterval(timer);
        } else {
          setLives((prev) => prev - 1);
          setShowingAnswer(true);
        }
        clearInterval(timer);
      } else if (!showingAnswer && !gameEnded) {
        setSecondsLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [secondsLeft, showingAnswer]);

  const handleNextQuestion = () => {
    setShowingAnswer(false);
    setSecondsLeft(30);
    setRecording(false);
    setResponse("");
  };

  const handleSkip = () => {
    if (lives === 1) {
      setGameEnded(true);
    } else {
      setShowingAnswer(true);
      setLives((prev) => prev - 1);
    }
  };

  return (
    <motion.div className={styles.wrapper}>
      <AnimatePresence>
        {showingAnswer && (
          <Answer
            key="answer"
            question={question}
            answer={answer}
            correct={correct}
            prevPoints={prevPoints}
            currPoints={points}
            continueGame={handleNextQuestion}
          />
        )}
        {gameEnded && null}
      </AnimatePresence>
      <motion.div
        className={styles.points}
        initial={{ x: "-50%", opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {points} {points === 1 ? "Point" : "Points"}
      </motion.div>
      <motion.span
        className={styles.question}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        1 + 6 = ?
      </motion.span>
      <motion.span
        className={styles.response}
        style={{ color: !response || !recording ? "gray" : undefined }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        {recording
          ? response
            ? response
            : "Say your answer!"
          : "Not recording..."}
      </motion.span>
      <motion.span
        className={styles.timeText}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        {secondsLeft} {secondsLeft === 1 ? "Second" : "Seconds"} Left!
      </motion.span>
      <motion.div
        className={styles.timer}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <motion.div
          className={styles.inner}
          initial={{ width: "100%" }}
          animate={{ width: `${(secondsLeft / 30) * 100}%` }}
        />
      </motion.div>
      <div className={styles.actionRow}>
        <motion.button
          style={{ backgroundColor: recording ? "#FA5454" : "#222222" }}
          onClick={() => setRecording((prev) => !prev)}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {recording ? (
            <>
              <FaRegStopCircle size="2rem" />
              Stop Recording
            </>
          ) : (
            <>
              <FaMicrophone size="2rem" />
              Record Response
            </>
          )}
        </motion.button>
        <motion.button
          style={{ backgroundColor: "#FA5454" }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={handleSkip}
        >
          <FaX /> Give Up
        </motion.button>
      </div>
      <UnstyledLink href="/play">
        <div className={styles.goBack}>Go Back</div>
      </UnstyledLink>
    </motion.div>
  );
};

export default function Countdown() {
  const [showHelp, setShowHelp] = useState<boolean>(true);
  return (
    <AnimatePresence mode="wait">
      {showHelp ? (
        <Help key="help" startGame={() => setShowHelp(false)} />
      ) : (
        <Game key="game" />
      )}
    </AnimatePresence>
  );
}
