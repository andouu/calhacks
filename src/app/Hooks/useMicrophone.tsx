"use client";
import { useContext } from "react";
import { MicrophoneContext } from "../Context/Microphone";

export const useMicrophone = () => {
  const value = useContext(MicrophoneContext);
  if (!value) {
    throw new Error("useMicrophone must be used within a MicrophoneProvider");
  }
  return value;
};
