// dateUtils.ts
export function formatDate(
  timestamp: Date | number | string | { seconds: number; nanoseconds: number }
): string {
  let date: Date;

  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === "number" || typeof timestamp === "string") {
    date = new Date(timestamp);
  } else if (timestamp && "seconds" in timestamp) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    return "Invalid Date";
  }

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleDateString();
}
