import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { DotLoader } from "react-spinners";

// Layout UI model for the dashboard page of Xpress Admin
export default function Home() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesResponse, productsResponse, ordersResponse] =
                    await Promise.all([
                        axios.get("/api/categories"),
                        axios.get("/api/products"),
                        axios.get("/api/orders"),
                    ]);

                setCategories(categoriesResponse.data);
                setProducts(productsResponse.data);
                setOrders(ordersResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error (e.g., show an error message to the user)
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Layout>
            <div className="flex flex-col">
                <div className="text-violet-900 flex justify-between">
                    <h1>
                        Hello, <b>{session?.user?.name}</b>
                    </h1>

                    <div className="flex bg-emerald-900 gap-1 text-white rounded-full overflow-hidden">
                        <img
                            src={session?.user?.image}
                            alt=""
                            className="w-11 h-11 rounded-full border-2 border-violet-100"
                        />
                        <span className="px-2 pt-2">
                            <b>{session?.user?.name}</b>
                        </span>
                    </div>
                </div>

                <div className="pic-outline min-w-full my-10 min-h-4 rounded-md px-2 py-4">
                    {/* Display loader instead of the h2 element */}
                    <span className="float mb-4 bg-bgGray font-bold flex items-center w-auto flex-col rounded-md">
                        <h1 className="text-emerald-900 font-bold">
                            Product Categories
                        </h1>
                        {loading ? (
                            <DotLoader
                                color="#00CED1"
                                loading={loading}
                                size={50}
                            />
                        ) : (
                            <h2 className="text-4xl">{categories.length}</h2>
                        )}
                        <h3 className="text-emerald-600">
                            Variety is our Priority
                        </h3>
                    </span>

                    {/* Repeat the same pattern for other sections */}
                    <span className="float mb-4 bg-bgGray font-bold flex items-center w-auto flex-col rounded-md">
                        <h1 className="text-emerald-900 font-bold">
                            Products available
                        </h1>
                        {loading ? (
                            <DotLoader
                                color="#00CED1"
                                loading={loading}
                                size={50}
                            />
                        ) : (
                            <h2 className="text-4xl">{products.length}</h2>
                        )}
                        <h3 className="text-emerald-600">
                            Commodities in stock
                        </h3>
                    </span>
                    <span className="float mb-4 bg-bgGray font-bold flex items-center w-auto flex-col rounded-md">
                        <h1 className="text-emerald-900 font-bold">
                            Pending orders
                        </h1>
                        {loading ? (
                            <DotLoader
                                color="#00CED1"
                                loading={loading}
                                size={50}
                            />
                        ) : (
                            <h2 className="text-4xl">{orders.length}</h2>
                        )}
                        <h3 className="text-emerald-600">Still in progress</h3>
                    </span>
                </div>
            </div>
        </Layout>
    );
}
