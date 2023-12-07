import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";

const GameBoard = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const audioRef = useRef(null); // Reference to the audio element
  const failureSoundRef = useRef(null); // Reference to the audio element for failure sound
  const matchSoundRef = useRef(null); // Reference to the audio element for match sound
  const tadaSoundRef = useRef(null); // Reference to the audio element for match sound
  const accessKey = 'BVoKh_9AiZAlcpVhyPKNSNBuFqA5-iBGsz_hVhe1Uis'; // Replace with your actual Unsplash access key
  const searchTerm = 'christmas'; // Search term for Christmas images

  const shuffleCards = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?count=8&query=${searchTerm}&client_id=${accessKey}`
      );

      if (response.ok) {
        const data = await response.json();
        const images = data.map((img, index) => ({
          id: index,
          image: img.urls.regular,
          isFlipped: false,
          isMatched: false,
        }));
        const pairImages = data.map((img, index) => ({
          id: index + data.length, // Add the length of the data array to the index to create unique ids
          image: img.urls.regular,
          isFlipped: false,
          isMatched: false,
        }));
        const shuffledCards = shuffleCards(images.concat(pairImages)); // Shuffle the cards
        setCards(shuffledCards); // Set the shuffled cards
      } else {
        console.error('Failed to fetch images');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      // Handle error if fetching fails
    }
  };

  useEffect(() => {
    fetchImages();
  }, [accessKey, searchTerm]);

  const playCardFlipSoundEffect = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const playFailureSoundEffect = () => {
    if (failureSoundRef.current) {
      failureSoundRef.current.currentTime = 0;
      failureSoundRef.current.play();
    }
  };

  const playMatchSoundEffect = () => {
    if (matchSoundRef.current) {
      matchSoundRef.current.currentTime = 0;
      matchSoundRef.current.play();
    }
  };

  const playTadaFanfareSoundEffect = () => {
    if (tadaSoundRef.current) {
      tadaSoundRef.current.currentTime = 0;
      tadaSoundRef.current.play();
    }
  };

  const handleCardClick = (id) => {
    const selectedCard = cards.find((card) => card.id === id);

    if (selectedCard.isMatched || selectedCard.isFlipped || flippedCards.length === 2) return;

    playCardFlipSoundEffect(); // Play the card flip sound effect on each card click

    const newCards = cards.map((card) =>
      card.id === id ? { ...card, isFlipped: true } : card
    );

    setCards(newCards);

    const updatedFlippedCards = [...flippedCards, selectedCard];

    if (updatedFlippedCards.length === 2) {
      const [firstCard, secondCard] = updatedFlippedCards;

      if (firstCard.image === secondCard.image) {
        const updatedCards = newCards.map((card) =>
          card.image === firstCard.image || card.image === secondCard.image
            ? { ...card, isMatched: true }
            : card
        );
        setCards(updatedCards);

        playMatchSoundEffect();

        if (updatedCards.every((card) => card.isMatched)) {
          playTadaFanfareSoundEffect();
          fetchImages(); // Fetch new images to reset the game
        }

      } else {
        setTimeout(() => {
          const resetCards = newCards.map((card) =>
            card.isMatched || !card.isFlipped ? card : { ...card, isFlipped: false }
          );
          setCards(resetCards);
          playFailureSoundEffect(); // Play the failure sound effect
        }, 1000);
      }
      setFlippedCards([]);
    } else {
      setFlippedCards(updatedFlippedCards);
    }
  };

  return (
    <div className="game-board">
      {cards.map((card) => (
        <Card key={card.id} card={card} onClick={() => handleCardClick(card.id)} />
      ))}
      <audio ref={audioRef} src="/Card-flip-sound-effect.mp3" />
      <audio ref={failureSoundRef} src="/failure-drum-sound-effect.mp3" />
      <audio ref={matchSoundRef} src="/match-sound-effect.mp3" />
      <audio ref={tadaSoundRef} src="/tada-fanfare.mp3" />
    </div>
  );
};

export default GameBoard;