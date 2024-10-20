import dynamic from "next/dynamic";
import { ReactNode } from "react";
const MicrophoneProvider = dynamic(() => import("../Context/Microphone"), {
  ssr: false,
});

export default function PlayLayout({ children }: { children: ReactNode }) {
  return <MicrophoneProvider>{children}</MicrophoneProvider>;
}
