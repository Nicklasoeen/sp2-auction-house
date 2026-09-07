export function getTimeLeft(endsAt: string): string {
  const timeLeft = new Date(endsAt).getTime() - Date.now();
  if (Number.isNaN(timeLeft) || timeLeft <= 0) return "Ended";

  const totalHours = Math.floor(timeLeft / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0) return `${days}d ${hours}h left`;
  return `${Math.max(hours, 1)}h left`;
}

export function getRelativeTime(date: string): string {
  const elapsed = Date.now() - new Date(date).getTime();
  if (Number.isNaN(elapsed) || elapsed < 0) return "Just now";

  const minutes = Math.floor(elapsed / (1000 * 60));
  if (minutes < 60)
    return `${Math.max(minutes, 1)} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
