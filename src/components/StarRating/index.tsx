import { BiSolidStar, BiSolidStarHalf, BiStar } from "react-icons/bi";

interface StarRatingProps {
  rating?: number; // giá trị từ 0 đến 5, ví dụ 4.3
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if(rating){
      if (rating >= i) {
        stars.push(<BiSolidStar key={i} className="text-yellow-500" />);
      } else if (rating >= i - 0.5) {
        stars.push(<BiSolidStarHalf key={i} className="text-yellow-500" />);
      } else {
        stars.push(<BiStar key={i} className="text-yellow-500" />);
      }
    }

  }

  return (
    <div className="flex items-center">
      <span className={`flex items-center`}>{stars}</span>
      <span className="text-sm  leading-none  align-middle">{rating}</span>
    </div>
  );
};

export default StarRating;