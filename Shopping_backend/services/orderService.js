
import { createOrder, getUserOrders } from "../model/orderModel.js";

export const placeUserOrder = async (userId, items, total) => {
  return await createOrder(userId, total, items);
};

export const fetchUserOrders = async (userId, page = 1, limit = 10) => {
  return await getUserOrders(userId, page, limit);
};
