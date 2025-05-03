import { useLoaderData } from "react-router-dom";

const PaymentHistory = () => {
  const payments = useLoaderData();

  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-8 px-4 md:px-12 lg:px-24 h-auto min-h-screen rounded shadow">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Payment History
      </h2>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <tr>
              <th className="py-4 px-2 md:px-6 border-b border-gray-700 text-sm md:text-base">
                Month
              </th>
              <th className="py-4 px-2 md:px-6 border-b border-gray-700 text-sm md:text-base">
                Payment Date
              </th>
              <th className="py-4 px-2 md:px-6 border-b border-gray-700 text-sm md:text-base">
                Amount
              </th>
              <th className="py-4 px-2 md:px-6 border-b border-gray-700 text-sm md:text-base">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="hover:bg-gray-200 transition duration-300"
              >
                <td className="py-3 px-2 md:px-6 border-b border-gray-300 text-gray-700 font-semibold text-sm md:text-base">
                  {formatMonth(payment.month)}
                </td>

                <td className="py-3 px-2 md:px-6 border-b border-gray-300 text-gray-700 font-semibold text-sm md:text-base">
                  {formatFullDate(payment.date)}
                </td>
                <td className="py-3 px-2 md:px-6 border-b border-gray-300 text-blue-700 font-bold text-sm md:text-base">
                  {payment.rent} Tk
                </td>
                <td
                  className={`py-3 px-2 md:px-6 border-b border-gray-300 font-semibold text-sm md:text-base ${
                    payment.status === "Paid"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {payment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
