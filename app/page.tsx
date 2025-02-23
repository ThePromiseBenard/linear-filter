"use client";

import { Activity, Users, AlertTriangle, Folder, Timer } from "lucide-react";
import { FilterBox } from "@/components/filter-box";
import type { FilterItem } from "@/lib/types/filter";

const filters: FilterItem[] = [
  {
    value: "status",
    label: "Status",
    labelPlural: "Statuses",
    icon: <Activity className="h-4 w-4" />,
    subItems: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "pending", label: "Pending" },
      { value: "archived", label: "Archived" },
    ],
  },
  {
    value: "priority",
    label: "Priority",
    labelPlural: "Priorities",
    icon: <AlertTriangle className="h-4 w-4" />,
    subItems: [
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
      { value: "critical", label: "Critical" },
    ],
  },
  {
    value: "type",
    label: "Type",
    labelPlural: "Types",
    icon: <Folder className="h-4 w-4" />,
    subItems: [
      { value: "bug", label: "Bug" },
      { value: "feature", label: "Feature" },
      { value: "improvement", label: "Improvement" },
      { value: "documentation", label: "Documentation" },
      { value: "security", label: "Security" },
    ],
  },
  {
    value: "category",
    label: "Category",
    labelPlural: "Categories",
    icon: <Users className="h-4 w-4" />,
    subItems: [
      { value: "frontend", label: "Frontend" },
      { value: "backend", label: "Backend" },
      { value: "database", label: "Database" },
      { value: "devops", label: "DevOps" },
      { value: "design", label: "Design" },
      { value: "testing", label: "Testing" },
    ],
  },
  {
    value: "stage",
    label: "Stage",
    labelPlural: "Stages",
    icon: <Timer className="h-4 w-4" />,
    subItems: [
      { value: "planning", label: "Planning" },
      { value: "development", label: "Development" },
      { value: "review", label: "Review" },
      { value: "testing", label: "Testing" },
      { value: "deployment", label: "Deployment" },
      { value: "completed", label: "Completed" },
    ],
  },
];

export default function Page() {
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Filter Demo</h1>
      <FilterBox filters={filters} className="bg-white border-gray-200" />
    </div>
  );
}
