"use client";
import { UnstyledLink } from "@/app/Components/UnstyledLink";
import styles from "./page.module.scss";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import { useMicrophone } from "@/app/Hooks/useMicrophone";
import { Random } from "@/app/Util/Random";
import { FaHeart, FaMicrophone, FaRegStopCircle } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

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
  answers: { [language: string]: string[] };
}

const ITEMS: Item[] = [
  {
    name: "apple",
    emoji: "🍎",
    answers: { es: ["mañana", "mañana."], ja: ["りんご", "アップル"] },
  },
  {
    name: "banana",
    emoji: "🍌",
    answers: {
      es: ["plátano", "plátano.", "platano"],
      ja: ["バナナ"],
    },
  },
  {
    name: "cherries",
    emoji: "🍒",
    answers: { es: ["guindas", "guindas."], ja: ["さくらんぼ", "チェリー"] },
  },
  {
    name: "grapes",
    emoji: "🍇",
    answers: { es: ["uvas", "uvas."], ja: ["ブドウ"] },
  },
  {
    name: "lemon",
    emoji: "🍋",
    answers: { es: ["limón", "limón.", "limon", "limon."], ja: ["レモン"] },
  },
  {
    name: "watermelon",
    emoji: "🍉",
    answers: {
      es: ["sandía", "sandía.", "sandia", "sandia."],
      ja: ["スイカ", "ウォーターメロン"],
    },
  },
  {
    name: "orange",
    emoji: "🍊",
    answers: { es: ["naranja", "naranja."], ja: ["オレンジ"] },
  },
  {
    name: "peach",
    emoji: "🍑",
    answers: { es: ["durazno", "durazno."], ja: ["桃", "ピーチ"] },
  },
  {
    name: "pear",
    emoji: "🍐",
    answers: { es: ["pera", "pera."], ja: ["梨", "ペア"] },
  },
];

const POINT_DELTA = 150;

const Game = () => {
  const [lives, setLives] = useState<number>(3);
  const [objects, setObjects] = useState<
    { id: string; initialX: number; item: Item }[]
  >([]);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const points = useMotionValue<number>(0);
  const formattedPoints = useTransform(() => Math.round(points.get()) + " pts");

  const { paused, togglePause, content, clearContent } = useMicrophone();

  useEffect(() => {
    const index = objects.findIndex((o) =>
      o.item.answers.es.includes(content.toLowerCase())
    );
    if (index !== -1) {
      setObjects((prev) => {
        const newObjects = [...prev];
        newObjects.splice(index, 1);
        return newObjects;
      });
      animate(points, points.get() + POINT_DELTA, {
        duration: 1,
        ease: "circInOut",
      });
    }
  }, [content]);

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
    }, 5000);

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
      if (!paused) {
        togglePause();
      }
    }
    setLives((prev) => prev - 1);
  };

  const handleClearBoard = () => {
    if (objects.length === 0) {
      return;
    }

    setObjects([]);
    clearContent();
    if (lives === 1) {
      setGameEnded(true);
      if (!paused) {
        togglePause();
      }
    }
    setLives((prev) => prev - 1);
  };

  const handlePlayAgain = () => {
    setLives(3);
    points.set(0);
    setGameEnded(false);
  };

  return (
    <AnimatePresence mode="sync">
      {gameEnded ? (
        <GameEnd
          key="gameEnd"
          points={points.get()}
          playAgain={handlePlayAgain}
        />
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
            <motion.span className={styles.points}>
              {formattedPoints}
            </motion.span>
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
                    bottom: { duration: 20, ease: "linear" },
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
                style={{ backgroundColor: !paused ? "#FA5454" : "#222222" }}
                onClick={togglePause}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
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
                transition={{ delay: 0.1 }}
                onClick={handleClearBoard}
              >
                <FaX /> Clear Board
              </motion.button>
            </div>
            <motion.div
              className={styles.response}
              style={{ color: !content || paused ? "gray" : undefined }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {!paused
                ? content
                  ? content
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

export default Game;
