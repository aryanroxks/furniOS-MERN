import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function MyReturns() {
    const navigate = useNavigate();

    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchReturns = async () => {
        try {
            const res = await api.get("/orders/returns/my");
            setReturns(res.data.data || []);
            console.log("API DATA:", res.data.data);

        } catch (err) {
            setError(err.response?.data?.message || "Failed to load returns");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReturns();
    }, []);

    if (loading) return <div className="p-6">Loading returns...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    if (!returns.length) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">My Returns</h2>
                <p className="text-gray-500">You haven’t requested any returns yet.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-semibold">My Returns</h2>

            {returns.map(ret => (
                <div
                    key={ret._id}
                    className="bg-white border rounded-lg p-5 space-y-3"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500">Return ID</p>
                            <p className="font-medium">{ret._id}</p>
                        </div>

                        <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                            {ret.status}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Order ID</p>
                            <p>{ret.orderID}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Refund Amount</p>
                            <p>₹{ret.refundAmount}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Refund Mode</p>
                            <p>{ret.refundMode}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Requested On</p>
                            <p>
                                {new Date(ret.requestedAt || ret.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Returned Products
                        </p>

                        <div className="space-y-2">
                            {ret.items?.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center text-sm border rounded-md px-3 py-2 bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.image?.url}
                                            alt={item.image?.name || item.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />

                                        <span className="font-medium">
                                            {item.name}
                                        </span>
                                    </div>

                                    <span className="text-gray-600">
                                        ₹{item.price} × {item.quantity}
                                    </span>
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* Action */}

                </div>
            ))}
        </div>
    );
}
