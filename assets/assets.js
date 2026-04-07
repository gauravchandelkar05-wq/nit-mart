import upload_area from "./upload_area.svg";
import { ClockFadingIcon, HeadsetIcon, SendIcon } from "lucide-react";

// --- UI ASSETS ---
export const assets = {
  upload_area,
};

export const categories = [
  "Books & Study Material",
  "Project & Lab Kits",
  "Electronics & Gadgets",
  "Dorm & Hostel Essentials",
  "Stationery & Art Supplies",
  "Clothing & Uniforms",
  "Bicycles & Transport",
];

export const ourSpecsData = [
  {
    title: "On-Campus Delivery",
    description:
      "Fast exchange between hostels and departments—no shipping fees.",
    icon: SendIcon,
    accent: "#4F46E5",
  },
  {
    title: "Instant Verification",
    description:
      "Secure trading within the NIT community using college credentials.",
    icon: ClockFadingIcon,
    accent: "#FF8904",
  },
  {
    title: "Student Support",
    description:
      "Run by students, for students. We're here to help you trade safely.",
    icon: HeadsetIcon,
    accent: "#A684FF",
  },
];

export const productDummyData = [];
export const orderDummyData = [];
export const dummyRatingsData = [];
export const dummyStoreDashboardData = {
  ratings: [],
  totalOrders: 0,
  totalEarnings: 0,
  totalProducts: 0,
};
