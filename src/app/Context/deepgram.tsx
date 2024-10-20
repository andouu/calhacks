import React, { useEffect, useState } from 'react';

const Deepgram: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Request access to the user's microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream: MediaStream) => {
        console.log({ stream });
        const mediaRecorder = new MediaRecorder(stream);
        const deepgramAPIKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY || "";
        const socket = new WebSocket("wss://api.deepgram.com/v1/listen", [
          "token",
          deepgramAPIKey,
        ]);
        

        // Handle WebSocket open event
        socket.onopen = () => {
          console.log({ event: 'onopen' });
          mediaRecorder.addEventListener('dataavailable', (event: BlobEvent) => {
            if (event.data.size > 0 && socket.readyState === 1) {
              socket.send(event.data);
            }
          });
          mediaRecorder.start(250);
        };

        // Handle WebSocket message event
        socket.onmessage = (message: MessageEvent) => {
          const received = JSON.parse(message.data);
          const receivedTranscript = received.channel?.alternatives[0]?.transcript;
          if (receivedTranscript && received.is_final) {
            setTranscript((prevTranscript) => `${prevTranscript} ${receivedTranscript}`);
             /**@todo check if user's answer is correct*/
          }
        };

        // Handle WebSocket close event
        socket.onclose = () => {
          console.log({ event: 'onclose' });
        };

        // Handle WebSocket error event
        socket.onerror = (error: Event) => {
          console.log({ event: 'onerror', error });
        };

        setSocket(socket);

        // Cleanup function to close WebSocket and stop recording
        return () => {
          mediaRecorder.stop();
          socket.close();
        };
      })
      .catch((error: Error) => {
        console.error('Error accessing microphone:', error);
      });
  }, []);

  return (
    <div>
      <h1>Speech-to-Text</h1>
      <p>{transcript}</p>
    </div>
  );
};

export default Deepgram;
