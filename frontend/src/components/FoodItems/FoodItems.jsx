import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./FoodItems.css";
import { assets } from "../../assets/assets";

const FoodItems = () => {
  const { food_list, setFoodList, cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food list:", error);
        setLoading(false);
      }
    };
    fetchFoodList();
  }, [setFoodList, url]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="food-items">
      {food_list.map((item) => (
        <div className="food-item" key={item._id}>
          <div className="food-items-image-container">
            <img
              className="food-items-image"
              src={url + "/uploads/" + item.image}
              alt=""
            />
            {!cartItems[item._id] ? (
              <img
                className="add"
                onClick={() => addToCart(item._id)}
                src={assets.add_icon_white}
                alt=""
              ></img>
            ) : (
              <div className="food-items-counter">
                <img
                  onClick={() => removeFromCart(item._id)}
                  src={assets.remove_icon_red}
                  alt=""
                />
                <span>{cartItems[item._id]}</span>
                <img
                  onClick={() => addToCart(item._id)}
                  src={assets.add_icon_red}
                  alt=""
                />
              </div>
            )}
          </div>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <span className="food-price">
            <p>{item.price}$</p>
          </span>
        </div>
      ))}
    </div>
  );
};

export default FoodItems;
