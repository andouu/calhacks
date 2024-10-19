"use client";
import { motion } from "framer-motion";
import styles from "./page.module.scss";
import { useState } from "react";
import { UnstyledLink } from "../Components/UnstyledLink";

export default function Play() {
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "expert"
  >();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.language}>🇪🇸 Spanish</div>
      <div className={styles.content}>
        <span className={styles.big}>Choose your game mode!</span>
        <div className={styles.difficultySelect}>
          <button
            className={styles.difficulty}
            style={{
              boxShadow:
                difficulty === "beginner"
                  ? "0 0 20px 0 var(--green)"
                  : undefined,
            }}
            onClick={() => setDifficulty("beginner")}
          >
            <div
              className={styles.face}
              style={{
                boxShadow: "0 0 2.5px 5px var(--green)",
                backgroundColor: "var(--green)",
              }}
            >
              <img src="/face.svg" />
            </div>
            <span>Beginner</span>
          </button>
          <button
            className={styles.difficulty}
            style={{
              boxShadow:
                difficulty === "intermediate"
                  ? "0 0 20px 0 var(--yellow)"
                  : undefined,
            }}
            onClick={() => setDifficulty("intermediate")}
          >
            <div
              className={styles.face}
              style={{
                boxShadow: "0 0 2.5px 5px var(--yellow)",
                backgroundColor: "var(--yellow)",
              }}
            >
              <img src="/face_small_neutral.svg" />
            </div>
            <span>Intermediate</span>
          </button>
          <button
            className={styles.difficulty}
            style={{
              boxShadow:
                difficulty === "expert" ? "0 0 20px 0 var(--red)" : undefined,
            }}
            onClick={() => setDifficulty("expert")}
          >
            <div
              className={styles.face}
              style={{
                boxShadow: "0 0 2.5px 5px var(--red)",
                backgroundColor: "var(--red)",
              }}
            >
              <img src="/face_small_frown.svg" />
            </div>
            <span>Expert</span>
          </button>
        </div>
        {difficulty && (
          <motion.div
            className={styles.gameSelect}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <UnstyledLink href="/play/countdown">
              <motion.div
                className={styles.game}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
                onHoverStart={() => setHovered("countdown")}
                onHoverEnd={() => setHovered(null)}
              >
                <span className={styles.icon}>💣</span>
                <span className={styles.title}>Countdown</span>
                <span className={styles.description}>
                  Learn the basics of numbers by solving math equations as fast
                  as possible.
                </span>
              </motion.div>
            </UnstyledLink>
            <UnstyledLink href="/play/fruitSlash">
              <motion.div
                className={styles.game}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.25, type: "spring" }}
                onHoverStart={() => setHovered("fruitSlash")}
                onHoverEnd={() => setHovered(null)}
              >
                <span className={styles.icon}>🍊</span>
                <span className={styles.title}>Fruit Slash</span>
                <span className={styles.description}>
                  Learn about fruits from a classic slashing game where fruits
                  are your mortal enemy.
                </span>
              </motion.div>
            </UnstyledLink>
          </motion.div>
        )}
      </div>
      <motion.div
        className={styles.ballWrapper}
        initial={{ y: "120vh", rotate: 90 }}
        animate={{
          y: "70vh",
          rotate:
            hovered === "countdown" ? -10 : hovered === "fruitSlash" ? 10 : 0,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 10 }}
      >
        <div className={styles.ball}>
          <img className={styles.face} src="/face.svg" />
        </div>
      </motion.div>
    </div>
  );
}
