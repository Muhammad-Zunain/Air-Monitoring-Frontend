export const getStats = (type) => (state) => {
  const entries = state.data.entries;

  if (!entries.length) return [];

  const values = entries.map((entry) => parseFloat(entry[type]));

  const current = values[values.length - 1];
  const highest = Math.max(...values);
  const lowest = Math.min(...values);

  const getIncrease = (current, previous) => {
    if (previous === 0) return "0%";
    const diff = ((current - previous) / previous) * 100;
    return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
  };

  return [
    {
      title: `Current ${capitalize(type)}`,
      value: formatValue(type, current),
      increase: getIncrease(current, values[values.length - 2] || current),
      description: "Since last record",
      icon: getIcon(type, "current"), // Use the string identifier here
    },
    {
      title: `Highest ${capitalize(type)} Today`,
      value: formatValue(type, highest),
      increase: getIncrease(highest, current),
      description: "Since last record",
      icon: getIcon(type, "high"), // Use the string identifier here
    },
    {
      title: `Lowest ${capitalize(type)} Today`,
      value: formatValue(type, lowest),
      increase: getIncrease(lowest, current),
      description: "Since last record",
      icon: getIcon(type, "low"), // Use the string identifier here
    },
  ];
};

// 🔧 Helpers
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const formatValue = (type, value) => {
  if (type === "temperature") return `${value}°C`;
  if (type === "humidity") return `${value}%`;
  if (type === "dust") return `${value} µg/m³`;
  return value;
};

// Return icon string identifiers
const getIcon = (type, variant) => {
  const colorMap = {
    temperature: "#FFA726",
    humidity: "#4FC3F7",
    dust: "#9E9D24",
  };

  switch (variant) {
    case "current":
      if (type === "temperature") return "thermostat"; // Return string identifier
      if (type === "humidity") return "humidity"; // Return string identifier
      if (type === "dust") return "dust"; // Return string identifier
      break;
    case "high":
      return "up"; // Return string identifier for "high"
    case "low":
      return "down"; // Return string identifier for "low"
    default:
      return null;
  }
};
