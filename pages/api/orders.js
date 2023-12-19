import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
    await mongooseConnect();
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
}
