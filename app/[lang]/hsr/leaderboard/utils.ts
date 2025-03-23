export type RegionType = {
  value: string;
  label: string;
  color: string;
};

export const regions: RegionType[] = [
  { value: "all", label: "All", color: "bg-gray-600" },
  { value: "na", label: "NA", color: "bg-blue-600" },
  { value: "eu", label: "EU", color: "bg-green-600" },
  { value: "asia", label: "ASIA", color: "bg-red-600" },
  { value: "cn", label: "CN", color: "bg-yellow-600" },
];
