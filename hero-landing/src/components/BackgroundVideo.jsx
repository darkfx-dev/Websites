import { useEffect, useRef } from "react";
import Hls from "hls.js";

const STREAM_URL =
  "https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8";

export default function BackgroundVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = STREAM_URL;
    } else if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(STREAM_URL);
      hls.attachMedia(video);
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover opacity-100"
      />
    </div>
  );
}
