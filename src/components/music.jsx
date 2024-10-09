import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaSearch } from 'react-icons/fa';

const AppContainer = styled.div`
  background-color: #111827;
  min-height: 100vh;
  color: white;
  font-family: 'Inter', sans-serif;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #4299e1, #9f7aea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SearchContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  background-color: #1f2937;
  border-radius: 9999px;
  overflow: hidden;
  padding: 0.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  flex-grow: 1;
  background-color: transparent;
  border: none;
  outline: none;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
`;

const SearchButton = styled(motion.button)`
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3182ce;
  }
`;

const SongGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const SongCard = styled(motion.div)`
  background-color: #1f2937;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
  }
`;

const SongImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${SongCard}:hover & {
    transform: scale(1.05);
  }
`;

const SongInfo = styled.div`
  padding: 1rem;
`;

const SongTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SongArtist = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0.25rem 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AudioPlayer = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(31, 41, 55, 0.8);
  backdrop-filter: blur(10px);
  padding: 1rem;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
`;

const PlayerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
`;

const PlayerSongInfo = styled.div`
  display: flex;
  align-items: center;
`;

const PlayerImage = styled(motion.img)`
  width: 4rem;
  height: 4rem;
  border-radius: 0.5rem;
  object-fit: cover;
  margin-right: 1rem;
`;

const PlayerControls = styled.div`
  display: flex;
  align-items: center;
`;

const ControlButton = styled(motion.button)`
  background-color: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s;

  &:hover {
    color: #4299e1;
  }
`;

const PlayPauseButton = styled(motion.button)`
  background-color: #4299e1;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3182ce;
    transform: scale(1.1);
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
`;

const VolumeSlider = styled.input`
  width: 100px;
  margin-left: 0.5rem;
  -webkit-appearance: none;
  background: #4a5568;
  outline: none;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #4299e1;
    cursor: pointer;
    border: 4px solid #1a202c;
    box-shadow: -100vw 0 0 100vw #4299e1;
  }
`;

const ProgressContainer = styled.div`
  margin-top: 1rem;
`;

const ProgressBar = styled.input`
  width: 100%;
  margin-bottom: 0.25rem;
  -webkit-appearance: none;
  background: #4a5568;
  outline: none;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #4299e1;
    cursor: pointer;
    border: 4px solid #1a202c;
    box-shadow: -100vw 0 0 100vw #4299e1;
  }
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #9ca3af;
`;

const WaveformContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin-top: 1rem;
`;

const WaveformBar = styled(motion.div)`
  width: 4px;
  height: 100%;
  background-color: #4299e1;
  margin: 0 2px;
  border-radius: 2px;
`;

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    if (!isSearching) {
      fetchTopSongs();
    }
  }, [isSearching]);

  useEffect(() => {
    if (currentSong) {
      audioRef.current.src = currentSong.previewUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSong]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleNext);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleNext);
    };
  }, []);

  const fetchTopSongs = async () => {
    try {
      const response = await fetch('https://itunes.apple.com/search?term=top100&entity=song&limit=20');
      const data = await response.json();
      setSongs(data.results);
    } catch (error) {
      console.error('Error fetching top songs:', error);
    }
  };

  const searchSongs = async () => {
    if (searchTerm) {
      setIsSearching(true);
      try {
        const response = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&entity=song&limit=20`);
        const data = await response.json();
        setSongs(data.results);
      } catch (error) {
        console.error('Error searching songs:', error);
      }
    } else {
      setIsSearching(false);
    }
  };

  const playSong = (song) => {
    setCurrentSong(song);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = songs.findIndex(song => song.trackId === currentSong.trackId);
    if (currentIndex < songs.length - 1) {
      setCurrentSong(songs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = songs.findIndex(song => song.trackId === currentSong.trackId);
    if (currentIndex > 0) {
      setCurrentSong(songs[currentIndex - 1]);
    }
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const waveformBars = 20;

  return (
    <AppContainer>
      <Container>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Musify
        </Title>

        <SearchContainer
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SearchInput
            type="text"
            placeholder="Search for songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={searchSongs}
          >
            <FaSearch />
          </SearchButton>
        </SearchContainer>

        <SongGrid
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AnimatePresence>
            {songs.map((song) => (
              <SongCard
                key={song.trackId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onClick={() => playSong(song)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SongImage
                  src={song.artworkUrl100.replace('100x100', '300x300')}
                  alt={song.trackName}
                />
                <SongInfo>
                  <SongTitle>{song.trackName}</SongTitle>
                  <SongArtist>{song.artistName}</SongArtist>
                </SongInfo>
              </SongCard>
            ))}
          </AnimatePresence>
        </SongGrid>
      </Container>

      {currentSong && (
        <AudioPlayer
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <PlayerContent>
            <PlayerSongInfo>
              <PlayerImage
                src={currentSong.artworkUrl100}
                alt={currentSong.trackName}
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
              <div>
                <SongTitle>{currentSong.trackName}</SongTitle>
                <SongArtist>{currentSong.artistName}</SongArtist>
              </div>
            </PlayerSongInfo>
            <PlayerControls>
              <ControlButton
                onClick={handlePrevious}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaStepBackward />
              </ControlButton>
              <PlayPauseButton
                onClick={togglePlayPause}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </PlayPauseButton>
              <ControlButton
                onClick={handleNext}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaStepForward />
              </ControlButton>
            </PlayerControls>

            <VolumeControl>
              <FaVolumeUp />
              <VolumeSlider
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
              />
            </VolumeControl>
          </PlayerContent>

          <ProgressContainer>
            <ProgressBar
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleTimeChange}
            />
            <TimeDisplay>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </TimeDisplay>
          </ProgressContainer>

          <WaveformContainer>
            {[...Array(waveformBars)].map((_, index) => (
              <WaveformBar
                key={index}
                initial={{ height: '20%' }}
                animate={{ height: isPlaying ? ['20%', '100%', '20%'] : '20%' }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: index * 0.1,
                }}
              />
            ))}
          </WaveformContainer>
        </AudioPlayer>
      )}
    </AppContainer>
  );
};

export default App;