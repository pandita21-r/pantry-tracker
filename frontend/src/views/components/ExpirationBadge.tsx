import type { ExpirationStatus } from "../../types/pantry";
import { AlertTriangle, CheckCircle, XCircle, Calendar } from "lucide-react";

interface ExpirationBadgeProps {
  status: ExpirationStatus;
  date?: string;
  className?: string;
}

const DAYS_TILL_EXPIRY = (date: string) => {
  const exp = new Date(date);
  const now = new Date();
  return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const FORMAT_DATE = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function ExpirationBadge({ status, date, className = "" }: ExpirationBadgeProps) {
  const configs = {
    fresh: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-400",
      icon: CheckCircle,
      label: date ? `${FORMAT_DATE(date)}` : "Fresh",
    },
    "expiring-soon": {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-700 dark:text-orange-400",
      icon: AlertTriangle,
      label: date ? `${DAYS_TILL_EXPIRY(date)}d left` : "Expiring",
    },
    expired: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-400",
      icon: XCircle,
      label: date ? `Exp. ${FORMAT_DATE(date)}` : "Expired",
    },
    "no-date": {
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-600 dark:text-gray-400",
      icon: Calendar,
      label: "No date",
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}
      data-testid={`badge-expiration-${status}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}
