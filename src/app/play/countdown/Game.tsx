"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { FaHeart, FaMicrophone, FaRegStopCircle } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { UnstyledLink } from "@/app/Components/UnstyledLink";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useMicrophone } from "../../Hooks/useMicrophone";

interface AnswerProps {
  latestResponse: string;
  question: string;
  answer: string;
  correct: boolean;
  prevPoints: number;
  currPoints: number;
  continueGame: () => void;
}

const Answer = ({
  latestResponse,
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
      exit={{ y: "100%" }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 15,
      }}
    >
      <span className={styles.title}>The answer was...</span>
      <div className={styles.answer}>
        <span className={styles.answerText}>{answer}</span>
        {/* <button className={styles.play}>
          <FaPlay />
        </button> */}
      </div>
      <div className={styles.yourAnswer}>
        <span>Your Answer: &quot;{latestResponse}&quot; </span>
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
          animate={{ y: -125, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {correct ? "Yay!! Correct Answer!" : "Aww... Wrong Answer"}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

interface Question {
  question: string;
  answers: string[];
}

const QUESTIONS: Question[] = [
  { question: "1 + 6 = ?", answers: ["7", "siete", "siete."] },
  { question: "1 + ? = 3", answers: ["2", "dos", "dos."] },
  { question: "? = 1 + 8", answers: ["9", "nueve", "nueve."] },
  { question: "1 + 5 = ?", answers: ["6", "seis", "seis."] },
  { question: "3 x 1 = ?", answers: ["3", "tres", "tres."] },
];

interface GameEndProps {
  points: number;
  playAgain: () => void;
}

const GameEnd = ({ points, playAgain }: GameEndProps) => {
  return (
    <motion.div
      className={styles.gameEndWrapper}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 15,
      }}
    >
      <span className={styles.title}>Game Over!</span>
      <span className={styles.score}>You scored {points} pts</span>
      <div className={styles.buttonRow}>
        <button className={styles.games} onClick={playAgain}>
          Play Again
        </button>
        <UnstyledLink href="/play">
          <button className={styles.games}>Back to Games</button>
        </UnstyledLink>
      </div>
      <motion.div
        className={styles.ballWrapper}
        initial={{ x: "-100%", y: "120vh", rotate: 90 }}
        animate={{
          x: "-50%",
          y: "55vh",
          rotate: 35,
        }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 15 }}
      >
        <div className={styles.ball}>
          <img className={styles.face} src="/face.svg" />
        </div>
        <motion.span
          className={styles.dialog}
          initial={{ x: "-50%", y: 0, opacity: 0 }}
          animate={{ y: -125, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Well Done!
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

const POINT_DELTA = 150;

const Game = () => {
  const [lives, setLives] = useState<number>(3);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [question, setQuestion] = useState<string>(QUESTIONS[0].question);
  const [answers, setAnswers] = useState<string[]>(QUESTIONS[0].answers);
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [latestResponse, setLatestResponse] = useState<string>("");
  const [prevPoints, setPrevPoints] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [correct, setCorrect] = useState<boolean>(false);
  const [showingAnswer, setShowingAnswer] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);

  const { paused, togglePause, content } = useMicrophone();

  useEffect(() => {
    if (content) {
      setLatestResponse(content);
      if (answers.includes(content.toLowerCase())) {
        setCorrect(true);
        setPoints((prev) => prev + POINT_DELTA);
        setShowingAnswer(true);
        if (!paused) {
          togglePause();
        }
      }
    }
  }, [content]);

  useEffect(() => {
    if (showingAnswer || gameEnded) {
      return;
    }

    const timer = setInterval(() => {
      if (secondsLeft === 0) {
        if (lives === 1) {
          setGameEnded(true);
          clearInterval(timer);
        } else {
          if (!paused) {
            togglePause();
          }
          setShowingAnswer(true);
        }
        setLives((prev) => prev - 1);
        clearInterval(timer);
      } else if (!showingAnswer && !gameEnded) {
        setSecondsLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [lives, gameEnded, secondsLeft, showingAnswer]);

  const handleNextQuestion = () => {
    setShowingAnswer(false);
    setSecondsLeft(30);
    setCorrect(false);
    setPrevPoints(points);
    setQuestionIndex((prev) => (prev + 1) % QUESTIONS.length);
  };

  useEffect(() => {
    setQuestion(QUESTIONS[questionIndex].question);
    setAnswers(QUESTIONS[questionIndex].answers);
  }, [questionIndex]);

  const handleSkip = () => {
    if (!paused) {
      togglePause();
    }
    if (lives === 1) {
      setGameEnded(true);
    } else {
      setShowingAnswer(true);
    }
    setLives((prev) => prev - 1);
  };

  const handlePlayAgain = () => {
    setLives(3);
    setPoints(0);
    setGameEnded(false);
    setShowingAnswer(false);
    setSecondsLeft(30);
    setCorrect(false);
  };

  return (
    <AnimatePresence mode="sync">
      {gameEnded ? (
        <GameEnd key="gameEnd" points={points} playAgain={handlePlayAgain} />
      ) : showingAnswer ? (
        <Answer
          key="answer"
          latestResponse={latestResponse}
          question={question}
          answer={answers[0]}
          correct={correct}
          prevPoints={prevPoints}
          currPoints={points}
          continueGame={handleNextQuestion}
        />
      ) : (
        <motion.div key="game" exit={{ opacity: 0 }}>
          <motion.div className={styles.wrapper}>
            <div className={styles.lives}>
              <motion.div animate={{ opacity: lives <= 2 ? 0.5 : 1 }}>
                <FaHeart />
              </motion.div>
              <motion.div animate={{ opacity: lives <= 1 ? 0.5 : 1 }}>
                <FaHeart />
              </motion.div>
              <motion.div animate={{ opacity: lives === 0 ? 0.5 : 1 }}>
                <FaHeart />
              </motion.div>
            </div>
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
              {question}
            </motion.span>
            <motion.span
              className={styles.response}
              style={{
                color: !content || paused ? "gray" : undefined,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {!paused
                ? content
                  ? content
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
                style={{ backgroundColor: !paused ? "#FA5454" : "#222222" }}
                onClick={togglePause}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                {!paused ? (
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Game;
