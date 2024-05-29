import userModel from "./../model/userModel.js";

//add items to user cart
const addtoCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartdata = await userData.cartData;
    if (!cartdata[req.body.itemId]) {
      cartdata[req.body.itemId] = 1;
    } else {
      cartdata[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
//remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartdata = await userData.cartData;
    if (!cartdata[req.body.itemId] > 0) {
      cartdata[req.body.itemId] -= 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//fetch user cart data

const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartdata = await userData.cartData;
    res.json({ success: true, cartdata });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

export { addtoCart, removeFromCart, getCart };
