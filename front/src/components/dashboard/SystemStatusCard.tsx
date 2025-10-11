import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SystemStatusCard: React.FC = () => {
  const [status, setStatus] = useState<"online" | "offline" | "loading">("loading");

  const checkStatus = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/");
      if (res.ok) {
        setStatus("online");
      } else {
        setStatus("offline");
      }
    } catch (err) {
      setStatus("offline");
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000); // every 5 sec
    return () => clearInterval(interval);
  }, []);

  const color =
    status === "online" ? "text-green-400" : status === "offline" ? "text-red-400" : "text-yellow-400";

  return (
    <Card className="bg-transparent border-none">
      {/* <CardHeader>
        <CardTitle className="text-lg text-gray-300">System Status</CardTitle>
      </CardHeader> */}
      <CardContent>
        <p className={`text-sm ${color}`}>
          {status === "loading"
            ? "Checking..."
            : status === "online"
            ? "🟢 Backend Online"
            : "🔴 Backend Offline / Fetch Failed"}
        </p>
      </CardContent>
    </Card>
  );
};

export default SystemStatusCard;
