"use client";
import { toast } from "sonner";

const Notification = ({
  duration = 3000,
  position = "top-right",
  type = "error",
  background,
  color = "white",
  fontSize = "16px",
  message,
}) => {
  return toast[type](message, {
    position,
    duration,
    style: { backgroundColor: (type === "success") ? "green" : (type === "warning") ? "orange" : (type === "error") ? "#ff4d4f" : background, color, fontSize },
  });
};

export default Notification;
