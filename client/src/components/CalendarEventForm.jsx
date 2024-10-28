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