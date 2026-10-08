export function nextDeparture(departures) {
  const now = new Date().toLocaleTimeString("en-GB", {
    timeZone: "Asia/Dhaka",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return [...departures].sort().find((t) => t > now) || null;
}