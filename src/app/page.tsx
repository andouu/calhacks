"use client";
import Link from "next/link";
import styles from "./page.module.scss";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <motion.span
          className={styles.big}
          initial={{ filter: "blur(5px)", scale: 2, opacity: 0 }}
          animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
          transition={{
            delay: 0.75,
            type: "spring",
            stiffness: 80,
            damping: 12.5,
          }}
        >
          Talking has never been so fun.
        </motion.span>
        <motion.span
          className={styles.small}
          initial={{ filter: "blur(5px)", scale: 2, opacity: 0 }}
          animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
          transition={{
            delay: 0.9,
            type: "spring",
            stiffness: 80,
            damping: 12.5,
          }}
        >
          Play vocal games that effectively teach you new languages, without
          being
          <br />
          boring, boring, boring.
        </motion.span>
        <Link href="/play">
          <motion.button
            className={`${styles.action} outlined`}
            initial={{ filter: "blur(5px)", scale: 0, opacity: 0 }}
            animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
            transition={{
              delay: 1.25,
              type: "spring",
              stiffness: 80,
              damping: 12.5,
            }}
          >
            Play Now!
          </motion.button>
        </Link>
      </div>
      <motion.div
        className={styles.ballWrapper}
        initial={{ y: "120vh", rotate: 90 }}
        animate={{
          y: "70vh",
          rotate: 0,
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
