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
  
    return (
      <form onSubmit={handleSubmit}>
        {/* Form fields go here */}
      </form>
    );
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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