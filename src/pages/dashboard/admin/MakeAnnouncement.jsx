import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { FaSortAmountUp, FaSortAmountDown } from "react-icons/fa";
import { format } from "date-fns";
import { Bold, ItalicIcon, Underline, UploadCloud } from "lucide-react";

const MakeAnnouncement = () => {
  const isDarkMode = true; // Replace with useContext(ThemeContext) if available
  const [announcement, setAnnouncement] = useState({
    title: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [announcementsPerPage] = useState(5);

  const fileInputRef = useRef(null);
  const editorRef = useRef(null);

  // Theme classes
  const bgMain = isDarkMode ? "bg-gray-900" : "bg-gray-50";
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const inputBg = isDarkMode ? "bg-gray-700" : "bg-white";
  const toolbarBg = isDarkMode ? "bg-gray-700" : "bg-gray-100";
  const activeButtonBg = isDarkMode ? "bg-gray-600" : "bg-gray-300";

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(
          "https://buildbox-server-side.vercel.app/announcements"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const data = await response.json();
        setAnnouncements(data);
        setFetchError(null);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setFetchError("Failed to load announcements");
      }
    };
    fetchAnnouncements();
  }, []);

  // Generate previews for image files
  const generatePreviews = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const newPreviews = [];
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push({
          url: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type,
        });
        if (newPreviews.length === imageFiles.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
    if (imageFiles.length === 0) {
      setPreviews([]);
    }
  };

  useEffect(() => {
    generatePreviews(files);
  }, [files]);

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const supportedFiles = droppedFiles.filter((file) =>
        file.type.startsWith("image/")
      );
      setFiles((prev) => [...prev, ...supportedFiles]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const supportedFiles = selectedFiles.filter((file) =>
        file.type.startsWith("image/")
      );
      setFiles((prev) => [...prev, ...supportedFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    const removedFile = newFiles.splice(index, 1)[0];
    setFiles(newFiles);
    setPreviews((prev) => prev.filter((p) => p.name !== removedFile.name));
  };

  const handleBrowseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Rich text editor controls
  const toggleStyle = (style) => {
    document.execCommand(style, false, null);
    switch (style) {
      case "bold":
        setIsBold(!isBold);
        break;
      case "italic":
        setIsItalic(!isItalic);
        break;
      case "underline":
        setIsUnderline(!isUnderline);
        break;
      default:
        break;
    }
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      setAnnouncement({
        ...announcement,
        description: editorRef.current.innerHTML,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAnnouncement = { ...announcement };

    if (!newAnnouncement.title || !newAnnouncement.description) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please fill in all required fields",
      });
      return;
    }

    try {
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      const uploadedImageUrls = [];

      if (imageFiles.length > 0) {
        const imageHostingApi = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMAGE_HOSTING_KEY
        }`;

        for (const file of imageFiles) {
          const formDataImage = new FormData();
          formDataImage.append("image", file);
          const res = await fetch(imageHostingApi, {
            method: "POST",
            body: formDataImage,
          });
          const data = await res.json();
          if (data.success) {
            uploadedImageUrls.push({
              name: file.name,
              type: file.type,
              size: file.size,
              url: data.data.display_url,
            });
          } else {
            throw new Error("Failed to upload image to ImgBB");
          }
        }
      }

      newAnnouncement.files = uploadedImageUrls;

      const response = await fetch(
        "https://buildbox-server-side.vercel.app/announcements",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAnnouncement),
        }
      );

      const data = await response.json();
      if (response.ok && data.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Announcement Added Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        setAnnouncements((prev) => [
          ...prev,
          { ...newAnnouncement, _id: data.insertedId, createdAt: new Date() },
        ]);
        resetForm();
      } else {
        throw new Error(data.message || "Failed to add announcement");
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message.includes("ImgBB")
          ? "Failed to upload images to ImgBB. Please try again."
          : "An error occurred while adding the announcement.",
      });
    }
  };

  const resetForm = () => {
    setAnnouncement({ title: "", description: "" });
    setFiles([]);
    setPreviews([]);
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  // Sorting and pagination for announcement list
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === "createdAt") {
      return sortDirection === "asc"
        ? new Date(a[sortField] || 0) - new Date(b[sortField] || 0)
        : new Date(b[sortField] || 0) - new Date(a[sortField] || 0);
    }
    return sortDirection === "asc"
      ? (a[sortField] || "").localeCompare(b[sortField] || "")
      : (b[sortField] || "").localeCompare(a[sortField] || "");
  });

  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement =
    indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = sortedAnnouncements.slice(
    indexOfFirstAnnouncement,
    indexOfLastAnnouncement
  );
  const totalPages = Math.ceil(
    sortedAnnouncements.length / announcementsPerPage
  );

  const formatDate = (dateString) =>
    dateString ? format(new Date(dateString), "yyyy/MM/dd") : "N/A";

  return (
    <div className={`min-h-screen p-4 md:p-8 ${bgMain} ${textColor}`}>
      <div className={`max-w-4xl mx-auto p-6 rounded-lg ${cardBg}`}>
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className={`text-3xl font-bold ${textColor}`}>
            Make Announcement
          </h1>
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Create and share announcements with your audience
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className={`block text-sm font-medium mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter announcement title"
              value={announcement.title}
              onChange={(e) =>
                setAnnouncement({ ...announcement, title: e.target.value })
              }
              className={`w-full ${inputBg} ${borderColor} ${textColor} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              required
            />
          </div>

          {/* Description (Rich Text Editor) */}
          <div>
            <label
              htmlFor="description"
              className={`block text-sm font-medium mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Description <span className="text-red-500">*</span>
            </label>
            <div className={`border ${borderColor} rounded-md overflow-hidden`}>
              <div
                className={`${toolbarBg} p-2 border-b ${borderColor} flex gap-2`}
              >
                <button
                  type="button"
                  className={`h-8 w-8 p-0 rounded ${
                    isBold ? activeButtonBg : ""
                  } hover:bg-gray-500`}
                  onClick={() => toggleStyle("bold")}
                >
                  <Bold className="h-4 w-4 mx-auto" />
                </button>
                <button
                  type="button"
                  className={`h-8 w-8 p-0 rounded ${
                    isItalic ? activeButtonBg : ""
                  } hover:bg-gray-500`}
                  onClick={() => toggleStyle("italic")}
                >
                  <ItalicIcon className="h-4 w-4 mx-auto" />
                </button>
                <button
                  type="button"
                  className={`h-8 w-8 p-0 rounded ${
                    isUnderline ? activeButtonBg : ""
                  } hover:bg-gray-500`}
                  onClick={() => toggleStyle("underline")}
                >
                  <Underline className="h-4 w-4 mx-auto" />
                </button>
              </div>
              <div
                ref={editorRef}
                contentEditable
                className={`min-h-[150px] p-3 focus:outline-none ${inputBg} ${textColor}`}
                onInput={updateContent}
                dangerouslySetInnerHTML={{ __html: announcement.description }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className={`${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              } ${textColor} rounded-md px-4 py-2 border`}
              onClick={resetForm}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Total Announcements */}
        <div className="mt-12">
          <h2 className={`text-2xl font-bold ${textColor} mb-4`}>
            Total Announcements
          </h2>
          <div
            className={`${cardBg} ${borderColor} rounded-lg p-6 shadow-lg border`}
          >
            <p className={`text-3xl font-bold text-indigo-600`}>
              {announcements.length}
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              } mt-1`}
            >
              Total announcements created
            </p>
          </div>
        </div>

        {/* List of Announcements */}
        <div className="mt-12">
          <h2 className={`text-2xl font-bold ${textColor} mb-6`}>
            All Announcements
          </h2>
          {fetchError ? (
            <div
              className={`text-center py-6 rounded-lg shadow-lg ${cardBg} ${borderColor}`}
            >
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {fetchError}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={isDarkMode ? "bg-gray-800" : "bg-gray-100"}>
                  <tr>
                    {["title", "description", "createdAt"].map((field) => (
                      <th
                        key={field}
                        scope="col"
                        className={`px-4 py-3 text-left text-xs font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-500"
                        } uppercase tracking-wider`}
                      >
                        <div
                          className="flex items-center cursor-pointer hover:text-indigo-500 transition-colors duration-200"
                          onClick={() => handleSort(field)}
                        >
                          <span>
                            {field === "createdAt"
                              ? "Created Date"
                              : field.charAt(0).toUpperCase() + field.slice(1)}
                          </span>
                          {sortField === field && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? (
                                <FaSortAmountUp size={14} />
                              ) : (
                                <FaSortAmountDown size={14} />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody
                  className={`divide-y divide-gray-200 dark:divide-gray-700 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  {currentAnnouncements.length > 0 ? (
                    currentAnnouncements.map((ann) => (
                      <tr
                        key={ann._id}
                        className={`hover:${
                          isDarkMode ? "bg-gray-700" : "bg-gray-50"
                        } transition-colors duration-200`}
                      >
                        <td
                          className={`px-4 py-4 whitespace-nowrap text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          {ann.title || "N/A"}
                        </td>
                        <td
                          className={`px-4 py-4 text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          <div
                            className="max-w-xs truncate"
                            dangerouslySetInnerHTML={{
                              __html: ann.description || "N/A",
                            }}
                          />
                        </td>
                        <td
                          className={`px-4 py-4 whitespace-nowrap text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          {formatDate(ann.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center">
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          No announcements found
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div
                  className={`flex items-center justify-between px-4 py-3 sm:px-6 ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  } rounded-b-lg shadow-lg mt-4`}
                >
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Showing{" "}
                      <span className="font-medium">
                        {indexOfFirstAnnouncement + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          indexOfLastAnnouncement,
                          sortedAnnouncements.length
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {sortedAnnouncements.length}
                      </span>{" "}
                      results
                    </p>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                          isDarkMode
                            ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                        } text-sm font-medium ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        ← Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? isDarkMode
                                  ? "bg-indigo-600 text-white border-indigo-600"
                                  : "bg-indigo-100 text-indigo-600 border-indigo-500"
                                : isDarkMode
                                ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                          isDarkMode
                            ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                        } text-sm font-medium ${
                          currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        Next →
                      </button>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MakeAnnouncement;
