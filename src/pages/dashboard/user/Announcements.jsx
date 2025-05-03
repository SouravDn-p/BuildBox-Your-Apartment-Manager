const Announcements = () => {
  // Example announcements data
  const announcements = [
    {
      id: 1,
      title: "Scheduled Maintenance",
      message:
        "The building will undergo maintenance on January 20th. Please be prepared for temporary outages.",
      date: "2025-01-15",
    },
    {
      id: 2,
      title: "Rent Payment Reminder",
      message:
        "Rent is due by the end of the month. Late fees will apply after the due date.",
      date: "2025-01-10",
    },
  ];

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Announcements</h2>
      <ul className="space-y-4">
        {announcements.map((announcement) => (
          <li key={announcement.id} className="border p-4 rounded shadow">
            <h3 className="font-semibold">{announcement.title}</h3>
            <p className="text-gray-600">{announcement.message}</p>
            <p className="text-sm text-gray-400">Date: {announcement.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Announcements;
