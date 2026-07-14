import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star } from 'lucide-react';

const ReviewPage = () => {
  const { id } = useParams(); // hotel id
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);

      const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async () => {
    if (!rating || !comment) {
      alert("Please fill all fields");
      return;
    }

    try {
        console.log(user)
      await axios.post(`http://localhost:8082/hotel/${id}/review`, {
        userName: user!=null?user.name:"Guest", 
        u_id:user!=null?user.id:0,
        rating,
        comment,
        date: new Date().toISOString().split("T")[0]
      });

      alert("Review submitted!");
      navigate(`/hotel/${id}`);

    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white p-8 rounded shadow w-[400px]">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Write a Review
        </h2>

       
        <div className="flex justify-center mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-8 h-8 cursor-pointer ${
                (hover || rating) >= star
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            />
          ))}
        </div>

       
        <textarea
          placeholder="Write your experience..."
          className="w-full border p-3 rounded mb-4"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-3 rounded"
        >
          Submit Review
        </button>

      </div>
    </div>
  );
};

export default ReviewPage;