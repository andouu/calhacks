"use client";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { FaHeart, FaMicrophone, FaRegStopCircle } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { UnstyledLink } from "@/app/Components/UnstyledLink";
import { Random } from "@/app/Util/Random";

interface HelpProps {
  startGame: () => void;
}

const Help = ({ startGame }: HelpProps) => {
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
          <img src="/fruits.png" />
          <p>
            Objects will fall from the top. You must say their names before they
            reach the bottom.
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

interface Item {
  name: string;
  emoji: string;
  answer: string;
}

const ITEMS: Item[] = [
  { name: "apple", emoji: "🍎", answer: "apple" },
  { name: "banana", emoji: "🍌", answer: "banana" },
  { name: "cherries", emoji: "🍒", answer: "cherries" },
  { name: "grapes", emoji: "🍇", answer: "grapes" },
  { name: "lemon", emoji: "🍋", answer: "lemon" },
  { name: "melon", emoji: "🍈", answer: "melon" },
  { name: "orange", emoji: "🍊", answer: "orange" },
  { name: "peach", emoji: "🍑", answer: "peach" },
  { name: "pear", emoji: "🍐", answer: "pear" },
];

const Game = () => {
  const [lives, setLives] = useState<number>(3);
  const [objects, setObjects] = useState<
    { id: string; initialX: number; item: Item }[]
  >([]);
  const [recording, setRecording] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [gameEnded, setGameEnded] = useState<boolean>(false);

  useEffect(() => {
    if (gameEnded) {
      return;
    }

    const spawner = setInterval(() => {
      if (!gameEnded) {
        const newObject = {
          id: window.crypto.randomUUID(),
          initialX: Random.getRandomInt(10, 90),
          item: ITEMS[Random.getRandomInt(0, ITEMS.length - 1)],
        };
        setObjects((prev) => [...prev, newObject]);
      }
    }, 3500);

    return () => {
      clearInterval(spawner);
    };
  }, [objects, gameEnded]);

  const handleFruitExit = (id: string) => {
    if (!objects.find((o) => o.id === id)) {
      return;
    }

    setObjects((prev) => prev.filter((o) => o.id !== id));
    if (lives === 1) {
      setObjects([]);
      setGameEnded(true);
    }
    setLives((prev) => prev - 1);
  };

  const handleClearBoard = () => {
    if (objects.length === 0) {
      return;
    }

    setObjects([]);
    setResponse(null);
    if (lives === 1) {
      setGameEnded(true);
    }
    setLives((prev) => prev - 1);
  };

  const handlePlayAgain = () => {
    setLives(3);
    setPoints(0);
    setGameEnded(false);
  };

  return (
    <AnimatePresence mode="sync">
      {gameEnded ? (
        <GameEnd key="gameEnd" points={points} playAgain={handlePlayAgain} />
      ) : (
        <motion.div key="game" className={styles.wrapper} exit={{ opacity: 0 }}>
          <div className={styles.stats}>
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
            <span className={styles.points}>
              {points} {points === 1 ? "pt" : "pts"}
            </span>
          </div>
          <div className={styles.objects}>
            <AnimatePresence>
              {objects.map(({ id, initialX, item }) => (
                <motion.div
                  key={id}
                  className={styles.object}
                  initial={{
                    left: `${initialX}%`,
                    bottom: "100%",
                    opacity: 0,
                    rotate: 0,
                  }}
                  animate={{ bottom: "-25%", opacity: 1, rotate: 360 }}
                  exit={{
                    fontSize: "200px",
                    opacity: 0,
                    transition: { duration: 0.25 },
                  }}
                  onAnimationComplete={(definition) => {
                    if (!("fontSize" in (definition as object))) {
                      handleFruitExit(id);
                    }
                  }}
                  transition={{
                    bottom: { duration: 10, ease: "linear" },
                    opacity: { duration: 0.5 },
                  }}
                >
                  {item.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className={styles.controls}>
            <div className={styles.actionRow}>
              <motion.button
                style={{ backgroundColor: recording ? "#FA5454" : "#222222" }}
                onClick={() => setRecording((prev) => !prev)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
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
                transition={{ delay: 0.1 }}
                onClick={handleClearBoard}
              >
                <FaX /> Clear Board
              </motion.button>
            </div>
            <motion.div
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
            </motion.div>
          </div>
          <UnstyledLink href="/play">
            <div className={styles.goBack}>Go Back</div>
          </UnstyledLink>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function FruitSlash() {
  const [showHelp, setShowHelp] = useState<boolean>(true);

  return (
    <AnimatePresence>
      {showHelp ? (
        <Help key="help" startGame={() => setShowHelp(false)} />
      ) : (
        <Game key="game" />
      )}
    </AnimatePresence>
  );
}
