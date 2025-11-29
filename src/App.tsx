import { useEffect, useState } from "react";
import { songs } from "./data/songs";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { MeshDistortMaterial, OrbitControls } from "@react-three/drei";

function extractYouTubeId(url: string) {
  // quick robust extractor for common YouTube formats
  const m = url.match(/(?:v=|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function MiniPlayer({ url }: { url: string }) {
  const id = extractYouTubeId(url);
  if (!id) return null;
  const src = `https://www.youtube.com/embed/${id}?rel=0&controls=1`;
  return (
    <div className="video-wrap">
      <iframe
        title="preview"
        src={src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

function BackgroundSphere() {
  // simple 3D distorted sphere for a techy, changing shape vibe
  // @ts-ignore - drei typing can be noisy in some setups
  return (
    <mesh rotation={[0.6, 0.4, 0]}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <MeshDistortMaterial color="#30E3C4" attach="material" distort={0.6} speed={1.0} roughness={0.15} />
    </mesh>
  );
}

function BackgroundCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 opacity-60">
      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <group rotation={[0.2, 0.4, 0]}>
          <BackgroundSphere />
        </group>
        {/* static controls for subtle parallax (no user interaction) */}
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

function App() {
  const [selectedMood, setSelectedMood] = useState<keyof typeof songs | null>(null);
  const [song, setSong] = useState<{title: string, artist: string, link: string} | null>(null);

  // emoji per mood
  const moodEmoji: Record<string,string> = {
    joyful: "🎻",
    serene: "🌊",
    melancholic: "🌧️",
    dramatic: "🔥",
    calm: "🪶",
    reflective: "🌙"
  };

  const moods = Object.keys(songs) as Array<keyof typeof songs>;

  const pickSong = (mood: keyof typeof songs) => {
    setSelectedMood(mood);
    const moodSongs = songs[mood];
    const random = moodSongs[Math.floor(Math.random() * moodSongs.length)];
    setSong(random);
  };

  const shuffleSong = () => {
    if (!selectedMood) return;
    const moodSongs = songs[selectedMood];
    if (moodSongs.length <= 1) return; // nothing to shuffle to
    // pick different from current
    let attempt = song;
    while (attempt && attempt.title === song?.title) {
      attempt = moodSongs[Math.floor(Math.random() * moodSongs.length)];
    }
    setSong(attempt || moodSongs[Math.floor(Math.random() * moodSongs.length)]);
  };

  // populate a default mood/song on first load (optional)
  useEffect(() => {
    if (!selectedMood) {
      pickSong(moods[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`app-bg ${selectedMood ? selectedMood : ""} flex min-h-screen items-center justify-center p-6`}>
      <BackgroundCanvas />

      <div className="w-full max-w-4xl flex flex-col items-center gap-6">
        <header className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl font-extrabold neon text-white"
          >
            🎵 Classical Mood Music
          </motion.h1>

          <div className="flex gap-3 flex-wrap">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => pickSong(m)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white/95 backdrop-blur-md bg-white/6 transition ${selectedMood === m ? "tech-ring scale-105" : "hover:scale-105"}`}
                aria-pressed={selectedMood === m}
              >
                <span className="mood-tag">{moodEmoji[m] ?? "🎶"} <span className="capitalize">{m}</span></span>
              </button>
            ))}
          </div>
        </header>

        <main className="w-full flex flex-col sm:flex-row gap-6 items-start">
          <section className="flex-1">
            {song && (
              <div className="card-glass p-6 rounded-xl shadow-2xl animate-float">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="mood-tag">{moodEmoji[selectedMood ?? ""] ?? "🎼"} <strong className="capitalize">{selectedMood}</strong></span>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">{song.title}</h2>
                    </div>
                    <p className="text-sm text-slate-200 mb-3">{song.artist}</p>

                    <div className="flex gap-3 flex-wrap">
                      <a
                        href={song.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 rounded-md bg-gradient-to-r from-royal to-turquoise text-white font-semibold"
                      >
                        Open on YouTube
                      </a>

                      <button
                        onClick={shuffleSong}
                        className="px-4 py-2 rounded-md bg-white/6 text-white font-semibold"
                        aria-label="Shuffle"
                      >
                        🔀 Shuffle
                      </button>
                    </div>
                  </div>
                </div>

                {/* mini player */}
                <MiniPlayer url={song.link} />
              </div>
            )}
          </section>

          <aside className="w-full sm:w-80">
            <div className="card-glass p-4 rounded-xl tech-ring">
              <h3 className="text-lg font-bold text-white mb-2">Now Playing</h3>
              {song ? (
                <>
                  <p className="text-sm text-slate-200 mb-3">{song.title}</p>
                  <p className="text-xs text-slate-300 mb-4">Curated classical picks for each mood.</p>
                  <div className="text-xs text-slate-300">Tip: click a mood to switch, or Shuffle to try another piece.</div>
                </>
              ) : (
                <p className="text-sm text-slate-300">Pick a mood to start.</p>
              )}
            </div>


          </aside>
        </main>

        <footer className="w-full text-center text-xl text-slate-300 mt-4">
              Classical Mood Music • built by nader hhh • nederbk n3mik
        </footer>
      </div>
    </div>
  );
}

export default App;
