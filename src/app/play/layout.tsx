import { ReactNode } from "react";
import { MicrophoneProvider } from "../Context/Microphone";

export default function PlayLayout({ children }: { children: ReactNode }) {
  return <MicrophoneProvider>{children}</MicrophoneProvider>;
}
