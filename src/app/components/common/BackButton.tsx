import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

interface BackButtonProps {
  to?: string;
  label: string;
  onClick?: () => void;
  className?: string;
}

export function BackButton({ to, label, onClick, className = "" }: BackButtonProps) {
  const classes = `inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B1A1A] transition-colors ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        <ArrowLeft size={15} />
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      <ArrowLeft size={15} />
      {label}
    </button>
  );
}
