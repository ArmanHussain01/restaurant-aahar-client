export const formatINR = (value) => {
  const num = Number(value);
  if (value === null || value === undefined || Number.isNaN(num)) {
    return "₹0";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatCount = (value) => {
  const num = Number(value);
  if (value === null || value === undefined || Number.isNaN(num)) {
    return 0;
  }
  return num;
};

export const formatHourLabel = (hour) => {
  const h = Number(hour);
  if (Number.isNaN(h)) return "";
  const period = h >= 12 ? "PM" : "AM";
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12} ${period}`;
};

export const formatDateLabel = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

export const formatMonthLabel = (year, month) => {
  if (!year || !month) return "";
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

export const toISODate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};


export const getPresetRange = (preset) => {
  const today = new Date();
  const end = new Date(today);

  switch (preset) {
    case "today": {
      return { startDate: toISODate(today), endDate: toISODate(today) };
    }
    case "week": {
      const start = new Date(today);
      const day = start.getDay(); // 0 = Sunday
      const diffToMonday = day === 0 ? 6 : day - 1;
      start.setDate(start.getDate() - diffToMonday);
      return { startDate: toISODate(start), endDate: toISODate(end) };
    }
    case "month": {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { startDate: toISODate(start), endDate: toISODate(end) };
    }
    case "year": {
      const start = new Date(today.getFullYear(), 0, 1);
      return { startDate: toISODate(start), endDate: toISODate(end) };
    }
    default:
      return { startDate: toISODate(today), endDate: toISODate(today) };
  }
};


export const getGranularity = (startDate, endDate) => {
  if (!startDate || !endDate) return "daily";
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

  if (diffDays <= 1) return "hourly";
  if (diffDays <= 62) return "daily";
  return "monthly";
};
