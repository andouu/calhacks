"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import RecordRTC from "recordrtc";

type MicrophoneContextType = {
  connected: boolean;
  socket: WebSocket | null;
  paused: boolean;
  togglePause: () => void;
  content: string;
  clearContent: () => void;
};

const MicrophoneContext = createContext<MicrophoneContextType>({
  connected: false,
  socket: null,
  paused: false,
  togglePause: () => {},
  content: "",
  clearContent: () => {},
});

export const useMicrophone = () => {
  const value = useContext(MicrophoneContext);
  if (!value) {
    throw new Error("useMicrophone must be used within a MicrophoneProvider");
  }
  return value;
};

const SAMPLE_RATE = 48000;

export const MicrophoneProvider = ({ children }: { children: ReactNode }) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(true);
  const socketRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const [content, setContent] = useState<string>("");

  const initSession = async () => {
    try {
      const res = await fetch(`https://api.gladia.io/v2/live`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-GLADIA-KEY": process.env.NEXT_PUBLIC_GLADIA_API_KEY || "",
        },
        body: JSON.stringify({
          sample_rate: SAMPLE_RATE,
          encoding: "wav/pcm",
          bit_depth: 16,
          channels: 1,
          language_config: {
            languages: ["en", "es", "jp"],
            code_switching: false,
          },
        }),
      });

      if (!res.ok) {
        const message = `${res.status}: ${
          (await res.text()) || res.statusText
        }`;
        throw new Error(message);
      }
      const { url } = await res.json();
      return url;
    } catch (err) {
      console.error(err);
    }
  };

  const initSocket = async () => {
    if (socketRef.current) return;

    try {
      const url = await initSession();
      socketRef.current = new WebSocket(url);

      socketRef.current.onopen = () => console.log("Gladia Socket Opened");
      socketRef.current.onerror = () => console.error("Gladia Socket Error");
      socketRef.current.onclose = () => console.warn("Gladia Socket Closed");
    } catch (err) {
      console.error(err);
    }
  };

  const initRecorder = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      recorderRef.current = new RecordRTC(audioStream, {
        type: "audio",
        mimeType: "audio/wav",
        recorderType: RecordRTC.StereoAudioRecorder,
        async ondataavailable(blob: Blob) {
          const buffer = await blob.arrayBuffer();
          const modifiedBuffer = buffer.slice(44);
          socketRef.current?.send(modifiedBuffer);
        },
        timeSlice: 100,
        sampleRate: SAMPLE_RATE,
        desiredSampRate: SAMPLE_RATE,
        numberOfAudioChannels: 1,
      });
      console.log("Started Recording");
    } catch (err) {
      console.error(err);
    }
  };

  const populateSocket = () => {
    if (socketRef.current) {
      socketRef.current.onopen = null;
      socketRef.current.onerror = null;
      socketRef.current.onclose = (e) => {
        const message = `Lost connection to the server: [${e.code}] ${e.reason}`;
        console.error(message);
      };
      socketRef.current.onmessage = (e) => {
        const message = JSON.parse(e.data);
        if (message?.type === "transcript") {
          console.log(message);
          if (message.data.type === "final") {
            setContent((prev) => prev + message.data.utterance.text.trim());
          } else {
            setContent(message.data.utterance.text.trim());
          }
        }
      };
    }
  };

  useEffect(() => {
    if (!recorderRef.current) return;

    if (paused) {
      console.log("paused recording");
      recorderRef.current.pauseRecording();
    } else {
      if (recorderRef.current.getState() === "inactive") {
        console.log("started recording");
        recorderRef.current.startRecording();
      } else {
        console.log("resumed recording");
        recorderRef.current.resumeRecording();
      }
    }
  }, [paused]);

  useEffect(() => {
    console.log("content updated: ", content);
  }, [content]);

  const initAll = async () => {
    try {
      await initSocket();
      await initRecorder();
      console.log(recorderRef.current);
      populateSocket();
      setConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (socketRef.current) return;

    initAll();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <MicrophoneContext.Provider
      value={{
        connected,
        socket: socketRef.current,
        paused,
        togglePause: () => setPaused((prev) => !prev),
        content,
        clearContent: () => setContent(""),
      }}
    >
      {children}
    </MicrophoneContext.Provider>
  );
};
