const MyProfile = () => {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    image: "https://via.placeholder.com/150",
    agreementDate: "None",
    apartmentInfo: {
      floor: "None",
      block: "None",
      roomNo: "None",
    },
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="flex items-center space-x-6">
        <img
          src={user.image}
          alt="User"
          className="w-24 h-24 rounded-full shadow"
        />
        <div>
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <p>
          <span className="font-semibold">Agreement Date:</span>{" "}
          {user.agreementDate}
        </p>
        <p>
          <span className="font-semibold">Apartment Info:</span> Floor:{" "}
          {user.apartmentInfo.floor}, Block: {user.apartmentInfo.block}, Room:{" "}
          {user.apartmentInfo.roomNo}
        </p>
      </div>
    </div>
  );
};

export default MyProfile;
