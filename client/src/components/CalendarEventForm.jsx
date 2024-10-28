import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Plus, X } from "lucide-react";

const CalendarEventForm = () => {
  const [formData, setFormData] = useState({
    summary: "",
    location: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    timeZone: "Africa/Lagos",
    attendees: [""],
  });
  const [status, setStatus] = useState({ message: "", isError: false });
  const [isLoading, setIsLoading] = useState(false);

  // // Add to your CalendarEventForm component
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const response = await fetch("http://localhost:8000/auth/status");
  //       const data = await response.json();
  //       if (data.status !== 200) {
  //         window.location.href = "http://localhost:8000/auth";
  //       }
  //     } catch (error) {
  //       console.error("Error checking auth status:", error);
  //       window.location.href = "http://localhost:8000/auth";
  //     }
  //   };

  //   checkAuth();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ message: "", isError: false });

    try {
      // Filter out empty attendee emails
      const validAttendees = formData.attendees.filter(
        (email) => email.trim() !== ""
      );

      // Create the URL with query parameters
      const url =
        `http://localhost:8000/create-event?` +
        `summary=${encodeURIComponent(formData.summary)}` +
        `&location=${encodeURIComponent(formData.location)}` +
        `&description=${encodeURIComponent(formData.description)}` +
        `&startDateTime=${encodeURIComponent(formData.startDateTime)}` +
        `&endDateTime=${encodeURIComponent(formData.endDateTime)}` +
        `&timeZone=${encodeURIComponent(formData.timeZone)}` +
        `&attendees=${encodeURIComponent(JSON.stringify(validAttendees))}`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setStatus({
          message: `Event created successfully! Meet link: ${data.link}`,
          isError: false,
        });
        // Reset form after successful submission
        setFormData({
          summary: "",
          location: "",
          description: "",
          startDateTime: "",
          endDateTime: "",
          timeZone: "Africa/Lagos",
          attendees: [""],
        });
      } else {
        throw new Error(data.message || "Failed to create event");
      }
    } catch (error) {
      setStatus({
        message: error.message || "An error occurred while creating the event",
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAttendeeChange = (index, value) => {
    setFormData((prev) => {
      const newAttendees = [...prev.attendees];
      newAttendees[index] = value;
      return { ...prev, attendees: newAttendees };
    });
  };

  const addAttendee = () => {
    setFormData((prev) => ({
      ...prev,
      attendees: [...prev.attendees, ""],
    }));
  };

  const removeAttendee = (index) => {
    if (formData.attendees.length > 1) {
      setFormData((prev) => ({
        ...prev,
        attendees: prev.attendees.filter((_, i) => i !== index),
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-800">
          Create Calendar Event
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Previous form fields remain the same until the timezone select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Title
          </label>
          <input
            type="text"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Tech Talk with Emmanuel"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Google Meet"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Event description..."
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              name="startDateTime"
              value={formData.startDateTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              name="endDateTime"
              value={formData.endDateTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Zone
          </label>
          <select
            name="timeZone"
            value={formData.timeZone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Africa/Lagos">Africa/Lagos</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Asia/Dubai">Asia/Dubai</option>
          </select>
        </div>

        {/* New Attendees Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Attendees
          </label>
          {formData.attendees.map((email, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => handleAttendeeChange(index, e.target.value)}
                placeholder="attendee@example.com"
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => removeAttendee(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                disabled={formData.attendees.length === 1}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAttendee}
            className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
          >
            <Plus className="w-4 h-4" /> Add Another Attendee
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Creating Event..." : "Create Event"}
        </button>
      </form>

      {status.message && (
        <Alert
          className={`mt-4 ${status.isError ? "bg-red-50" : "bg-green-50"}`}
        >
          <AlertDescription
            className={status.isError ? "text-red-800" : "text-green-800"}
          >
            {status.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CalendarEventForm;
