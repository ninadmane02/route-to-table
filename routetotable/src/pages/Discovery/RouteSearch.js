import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  Polyline
} from "@react-google-maps/api";
import axios from "axios";
import { useNavigate } from "react-router";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 18.5204,
  lng: 73.8567,
};

const RouteSearch = () => {
  // const [from, setFrom] = useState("");

  const [from, setFrom] = useState("");       // for input display
const [fromCoords, setFromCoords] = useState(null); // for map logic
  const [to, setTo] = useState("");

  const [allHotels, setAllHotels] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [routeHotels, setRouteHotels] = useState([]);

  const [selectedHotel, setSelectedHotel] = useState(null);

  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  const [routePath, setRoutePath] = useState([]);
  const [isRouteSearched, setIsRouteSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  
  const [filters, setFilters] = useState({
    cuisine: "",
    rating: 0,
    price: "",
    veg: ""
  });

 
  useEffect(() => {
    axios.get("http://localhost:8082/hotel/all")
      .then(res => {
        setAllHotels(res.data);
        setHotels(res.data);
      });
  }, []);


 const getCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const location = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };

      setFromCoords(location);
      setFrom("Your Location 📍"); 
    },
    () => alert("Location permission denied")
  );
};

 
  const getLatLng = async (place) => {
    const res = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      { params: { q: place, format: "json" } }
    );

    return {
      lat: parseFloat(res.data[0].lat),
      lng: parseFloat(res.data[0].lon)
    };
  };

  
  const getRoutes = async (fromLoc, toLoc) => {
    const url =
      `http://router.project-osrm.org/route/v1/driving/` +
      `${fromLoc.lng},${fromLoc.lat};${toLoc.lng},${toLoc.lat}` +
      `?alternatives=true&overview=full&geometries=geojson`;

    const res = await axios.get(url);

    return res.data.routes.map(r =>
      r.geometry.coordinates.map(([lng, lat]) => ({
        lat,
        lng
      }))
    );
  };

  const handleSearch = async () => {
    setSelectedHotel(null);
    
    if (!from || !to) return alert("Enter locations");

    setLoading(true);

    try {
      const fromLoc =
  fromCoords ||
  await getLatLng(from);
      const toLoc = typeof to === "string" ? await getLatLng(to) : to;

      const allRoutes = await getRoutes(fromLoc, toLoc);

      setRoutes(allRoutes);
      setSelectedRouteIndex(0);
      setIsRouteSearched(true);

      
     const res = await axios.post(
  "http://localhost:8082/hotel/search/route-hotels",
  {
    routePoints: allRoutes[0],
    start: fromLoc,   
    end: toLoc        
  }
);

      setRouteHotels(res.data);
      setHotels(res.data);

    } catch (err) {
      console.log(err);
      alert("Route not found");
    } finally {
      setLoading(false);
    }
  };

  
const handleRouteChange = async (index) => {
  setSelectedRouteIndex(index);

  try {
    const fromLoc =
      fromCoords || await getLatLng(from);

    const toLoc =
      typeof to === "string" ? await getLatLng(to) : to;

    const res = await axios.post(
      "http://localhost:8082/hotel/search/route-hotels",
      {
        routePoints: routes[index],
        start: fromLoc,   
        end: toLoc        
      }
    );

    setRouteHotels(res.data);
    setHotels(res.data);

  } catch (err) {
    console.log(err);
  }
};  
 
  const applyFilters = async () => {
    if (!isRouteSearched) return;

    const res = await axios.post(
      "http://localhost:8082/hotel/search/route-hotels",
      {
        routePoints: routes[selectedRouteIndex],
        cuisine: filters.cuisine || null,
        rating: filters.rating || null,
        price: filters.price || null,
        veg: filters.veg || null
      }
    );

    // setHotels(res.data);
    setHotels(res.data);
setRouteHotels(res.data);
  };

  return (
    <div className="p-6">

      
      <div className="grid md:grid-cols-4 gap-4 mb-4">

       <input
  value={from}
  onChange={(e) => setFrom(e.target.value)}
  placeholder="From"
   className="input-field"
/>
<input
  value={to}
  onChange={(e) => {
    setTo(e.target.value);

    setRoutes([]);
    setHotels([]);
    setRouteHotels([]);
    setSelectedHotel(null);
    setIsRouteSearched(false);
  }}
  placeholder="To"
  className="input-field"
/>

        <button onClick={handleSearch} className="btn-primary">
          {loading ? "Searching..." : "Search Route"}
        </button>

        <button onClick={getCurrentLocation} className="btn-primary">
          Use Current Location
        </button>
      </div>

      
      {routes.length > 0 && (
        <div className="mb-4">
          <h3>Select Route:</h3>

          {routes.map((_, i) => (
            <button
              key={i}
              onClick={() => handleRouteChange(i)}
              className={`mr-2 px-3 py-1 ${
                selectedRouteIndex === i
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Route {i + 1}
            </button>
          ))}
        </div>
      )}

      
      <div className="grid md:grid-cols-4 gap-4 mb-4">

        <select onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })} className="input-field">
          <option value="Cuisine">Cuisine</option>
          <option value="Indian">Indian</option>
         
        </select>

        <select onChange={(e) => setFilters({ ...filters, veg: e.target.value })} className="input-field">
          <option value="">Veg/NonVeg</option>
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </select>

        <select onChange={(e) => setFilters({ ...filters, rating: e.target.value })} className="input-field">
          <option value="0">Rating</option>
          <option value="4">4+</option>
          <option value="3">3+</option>
        </select>

        <select onChange={(e) => setFilters({ ...filters, price: e.target.value })} className="input-field">
          <option value="">Price</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button onClick={applyFilters} className="btn-primary md:col-span-4">
          Apply Filters
        </button>
      </div>

    
      {routeHotels.length > 0 && (
        <div className="mb-4">
          <select
            className="input-field w-full"
            onChange={(e) => {
              const hotel = routeHotels.find(
                h => h.h_id === parseInt(e.target.value)
              );
              setSelectedHotel(hotel);
              // setHotels([hotel]);
            }}
          >
            <option value="">Select Hotel on Route</option>
            {routeHotels.map(h => (
              <option key={h.h_id} value={h.h_id}>
                {h.h_name} ⭐ {h.rating}
              </option>
            ))}
          </select>
        </div>
      )}

     
      <LoadScript googleMapsApiKey="AIzaSyAMj31HCM1vRrqxrfRnAEK9WQwOnxYpQ0E">
        <GoogleMap
  key={routes.length}   // 🔥 forces map refresh
  mapContainerStyle={mapContainerStyle}
  center={defaultCenter}
  zoom={10}
>

          {/* ROUTES */}
          {routes.map((route, i) => (
            <Polyline
              key={i}
              path={route}
              options={{
                strokeColor: i === selectedRouteIndex ? "blue" : "gray",
                strokeWeight: i === selectedRouteIndex ? 5 : 3
              }}
            />
          ))}

          
          {hotels.map(h => (
            <Marker
              key={h.h_id}
              position={{
                lat: parseFloat(h.latitude),
                lng: parseFloat(h.longitude)
              }}
              onClick={() => setSelectedHotel(h)}
            />
          ))}

       
          {selectedHotel && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedHotel.latitude),
                lng: parseFloat(selectedHotel.longitude)
              }}
              onCloseClick={() => setSelectedHotel(null)}
            >
              <div>
                <h3>{selectedHotel.h_name}</h3>
                <p>⭐ {selectedHotel.rating}</p>

                <button
                  onClick={() => navigate(`/hotel/${selectedHotel.h_id}`)}
                  className="bg-blue-600 text-white px-3 py-1 mt-2 rounded"
                >
                  View Details
                </button>
              </div>
            </InfoWindow>
          )}

        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default RouteSearch;