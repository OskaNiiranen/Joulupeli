const Card = ({ card, onClick }) => {
  return (
    <div className={`card ${card.isFlipped ? "flipped" : ""}`} onClick={() => onClick(card.id)}>
      {card.isFlipped ? (
        <img src={card.image} alt="Front" />
      ) : (
        <div className="card-back"></div>
      )}
    </div>
  );
};

export default Card;
