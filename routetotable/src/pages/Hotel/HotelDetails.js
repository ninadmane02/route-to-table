import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, Phone, Info, CheckCircle, ArrowRight, Utensils } from 'lucide-react';
import { Navigation } from 'lucide-react';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
const handleDirections = () => {
  if (!hotel) return;

  const destination = `${hotel.latitude},${hotel.longitude}`;

  
  const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  window.open(url, "_blank");
};
// const handleDirections = () => {
//   if (!hotel) return;

//   // 🔥 Get current location
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const origin = `${position.coords.latitude},${position.coords.longitude}`;
//         const destination = `${hotel.latitude},${hotel.longitude}`;

//         const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;

//         window.open(url, "_blank");
//       },
//       (error) => {
//         console.error("Location error:", error);

//         // fallback if user denies permission
//         const destination = `${hotel.latitude},${hotel.longitude}`;
//         const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

//         window.open(url, "_blank");
//       }
//     );
//   } else {
//     alert("Geolocation is not supported by your browser");
//   }
// };
const fetchReviews = async () => {
  try {
    const res = await axios.get(`http://localhost:8082/hotel/${id}/reviews`);
    setReviews(res.data);
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};

  useEffect(() => {
    fetchHotel();
     fetchReviews();
  }, [id]);

  const fetchHotel = async () => {
    try {
      const res = await axios.get(`http://localhost:8082/hotel/${id}`);
      console.log(res.data)
      setHotel(res.data);
    } catch (error) {
      console.error("Error fetching hotel:", error);
    }
  };

  if (!hotel) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

     
      <div className="h-[400px] relative">
        <img 
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9"
          className="w-full h-full object-cover" 
          alt={hotel.h_name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent"></div>

        <div className="absolute bottom-10 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 text-white">
            <h1 className="text-4xl font-bold mb-4">{hotel.h_name}</h1>

            <div className="flex gap-6 items-center">
              <span className="flex items-center gap-1 bg-primary px-3 py-1 rounded font-bold">
                <Star className="w-4 h-4 fill-current" /> {hotel.rating}
              </span>

              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5" /> {hotel.h_address}
              </span>

              <span className="flex items-center gap-2">
                <Phone className="w-5 h-5" /> {hotel.h_contact}
              </span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

       
        <div className="lg:col-span-2 space-y-12">

          <section>
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-gray-600">
              Cuisine: {hotel.cuisineType} <br />
              City: {hotel.h_city} <br />
              Open: {hotel.openingTime} - {hotel.closingTime}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Facilities</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Parking', 'AC', 'WiFi', 'Restroom'].map(f => (
                <div key={f} className="flex items-center gap-2 bg-white p-3 rounded shadow">
                  <CheckCircle className="text-green-500" />
                  {f}
                </div>
              ))}
            </div>
          </section>
          <section>
  <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

  {hotel.reviews && hotel.reviews.length > 0 ? (
    <div className="space-y-4">
      {hotel.reviews.map((review) => (
        <div key={review.id} className="bg-white p-4 rounded shadow">

          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold">{review.userName}</h4>

            <span className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 fill-current mr-1" />
              {review.rating}
            </span>
          </div>

          <p className="text-gray-600">{review.comment}</p>

          <p className="text-xs text-gray-400 mt-2">
            {review.date}
          </p>

        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No reviews yet</p>
  )}
</section>

        </div>

       
        <div>
          <div className="bg-white p-6 rounded shadow sticky top-20">

            <h3 className="text-xl font-bold mb-2">Book Table</h3>

            <p className="text-sm text-gray-500 mb-4">
              Price: {hotel.priceCategory}
            </p>

            <div className="bg-yellow-100 p-3 rounded mb-4 flex gap-2">
              <Info className="text-yellow-600" />
              <p className="text-sm">
                Booking valid for 30 mins
              </p>
            </div>

           
            <button
              onClick={() => navigate(`/hotel/menu/${hotel.h_id}`)}
              className="w-full bg-green-600 text-white py-3 rounded flex justify-center gap-2 mb-3"
            >
              See Menu
              <Utensils />
            </button>
            <button
  onClick={handleDirections}
  className="w-full bg-blue-600 text-white py-3 rounded flex justify-center gap-2 mb-3"
>
  Get Directions
  <Navigation />
</button>

           
           <button
  onClick={() => navigate(`/review/${hotel.h_id}`)}
  className="w-full bg-purple-600 text-white py-3 rounded flex justify-center gap-2"
>
  Write Review
  <Star />
</button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default HotelDetails;