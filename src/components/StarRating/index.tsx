import { BiSolidStar, BiSolidStarHalf, BiStar } from "react-icons/bi";
import { JSX, useEffect, useState } from "react";

interface StarRatingProps {
  rating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {

  const [starts, setStarts] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const stars: JSX.Element[] = [];
    for (let i = 1; i <= 5; i++) {
      if (typeof rating === 'number') {
        if (rating >= i) {
          stars.push(<BiSolidStar key={i} className="text-yellow-500" />);
        } else if (rating >= i - 0.5) {
          stars.push(<BiSolidStarHalf key={i} className="text-yellow-500" />);
        } else {
          stars.push(<BiStar key={i} className="text-yellow-500" />);
        }
      }
    }
    setStarts(stars);
  }, [rating]);

  return (
    <div className="flex items-center">
        <span className={`flex items-center`}>{starts}</span>
    </div>
  );
};

export default StarRating;