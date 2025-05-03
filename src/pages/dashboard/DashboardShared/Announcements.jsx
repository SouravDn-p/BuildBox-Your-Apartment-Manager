import { useLoaderData } from "react-router-dom";

const Announcements = () => {
  const announcements = useLoaderData();
  console.log(announcements);
  return (
    <div className="bg-slate-700 min-h-screen text-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Announcements</h2>
      <ul className="space-y-4">
        {announcements.map((announcement) => (
          <li
            key={announcement._id}
            className="border bg-slate-800 p-4 rounded shadow"
          >
            <h3 className="font-semibold">{announcement.title}</h3>
            <p>{announcement.description}</p>
            <p className="text-sm text-gray-400">
              Date: {announcement.date || "N/A"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Announcements;
