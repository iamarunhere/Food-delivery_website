import React, { useContext } from "react";
import "./FoodItems.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
const FoodItems = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  return (
    <div className="food-items">
      <div className="food-items-image-container">
        <img
          className="food-items-image"
          src={url + "/images/" + image}
          alt=""
        />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          ></img>
        ) : (
          <div className="food-items-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt=""
            ></img>
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt=""
            ></img>
          </div>
        )}
      </div>
      <div className="food-items-info">
        <div className="food-items-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt=""></img>
        </div>
        <p className="food-items-description">{description}</p>
        <p className="food-items-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItems;
