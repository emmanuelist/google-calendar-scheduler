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