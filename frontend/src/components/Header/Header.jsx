import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="Header">
      <div className="Header-contents">
        <h2>Order your favourite food here</h2>
        <p>
          Experience the convenience of ordering food online, where your
          favorite meals are just a click away. Fast, fresh, and delivered to
          your door—satisfy your cravings effortlessly
        </p>
        <a href="#food-items">
          <button>View Menu</button>
        </a>
      </div>
    </div>
  );
};

export default Header;
