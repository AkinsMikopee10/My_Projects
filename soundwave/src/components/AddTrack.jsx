import React, { useState } from "react";
import { Plus, X } from "lucide-react";

/**
 * AddTrack Component
 * Form to add new tracks to the playlist
 *
 * Props:
 * @param {function} onAddTrack - Function called when track is added
 */
function AddTrack({ onAddTrack }) {
  // State for showing/hiding the form
  const [isFormOpen, setIsFormOpen] = useState(false);

  // State for form fields
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    cover: "",
    audio: "",
  });

  /**
   * Handle input changes
   * Updates the corresponding field in formData
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Update only the changed field
    }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload

    // Validate: All fields are required
    if (!formData.title || !formData.artist || !formData.audio) {
      alert("Please fill in at least Title, Artist, and Audio URL");
      return;
    }

    // Call the parent's addTrack function
    onAddTrack(formData);

    // Reset form and close
    setFormData({
      title: "",
      artist: "",
      album: "",
      cover: "",
      audio: "",
    });
    setIsFormOpen(false);
  };

  /**
   * Cancel and close form
   */
  const handleCancel = () => {
    setIsFormOpen(false);
    // Reset form data
    setFormData({
      title: "",
      artist: "",
      album: "",
      cover: "",
      audio: "",
    });
  };

  return (
    <div className="mt-6">
      {/* Button to open form */}
      {!isFormOpen && (
        <button
          onClick={() => setIsFormOpen(true)}
          className="
            w-full p-4 
            bg-purple-600 hover:bg-purple-700 
            text-white font-medium rounded-xl
            transition-all duration-200
            hover:shadow-lg
            active:scale-[0.98]
            flex items-center justify-center gap-2
          "
        >
          <Plus className="w-5 h-5" />
          Add New Track
        </button>
      )}

      {/* Form (shown when isFormOpen is true) */}
      {isFormOpen && (
        <div
          className="
          bg-white dark:bg-gray-800 
          rounded-2xl shadow-lg p-6
          transition-all duration-300
        "
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Add New Track
            </h3>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              aria-label="Close form"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="
                  w-full px-3 py-2 
                  bg-gray-50 dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                  rounded-lg
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-purple-600 focus:border-transparent
                  transition-all duration-200
                "
                placeholder="Enter song title"
              />
            </div>

            {/* Artist Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Artist *
              </label>
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                required
                className="
                  w-full px-3 py-2 
                  bg-gray-50 dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                  rounded-lg
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-purple-600 focus:border-transparent
                  transition-all duration-200
                "
                placeholder="Enter artist name"
              />
            </div>

            {/* Album Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Album
              </label>
              <input
                type="text"
                name="album"
                value={formData.album}
                onChange={handleInputChange}
                className="
                  w-full px-3 py-2 
                  bg-gray-50 dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                  rounded-lg
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-purple-600 focus:border-transparent
                  transition-all duration-200
                "
                placeholder="Enter album name"
              />
            </div>

            {/* Cover URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                name="cover"
                value={formData.cover}
                onChange={handleInputChange}
                className="
                  w-full px-3 py-2 
                  bg-gray-50 dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                  rounded-lg
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-purple-600 focus:border-transparent
                  transition-all duration-200
                "
                placeholder="https://example.com/cover.jpg"
              />
            </div>

            {/* Audio URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Audio URL *
              </label>
              <input
                type="url"
                name="audio"
                value={formData.audio}
                onChange={handleInputChange}
                required
                className="
                  w-full px-3 py-2 
                  bg-gray-50 dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                  rounded-lg
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-purple-600 focus:border-transparent
                  transition-all duration-200
                "
                placeholder="https://example.com/song.mp3"
              />
            </div>

            {/* Form Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="
                  flex-1 px-4 py-2
                  bg-purple-600 hover:bg-purple-700
                  text-white font-medium rounded-lg
                  transition-all duration-200
                  active:scale-[0.98]
                "
              >
                Add Track
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="
                  flex-1 px-4 py-2
                  bg-gray-200 hover:bg-gray-300
                  dark:bg-gray-700 dark:hover:bg-gray-600
                  text-gray-800 dark:text-white font-medium rounded-lg
                  transition-all duration-200
                  active:scale-[0.98]
                "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddTrack;
