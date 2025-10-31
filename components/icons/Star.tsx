import React from "react";

interface StarIconProps {
  className?: string;
  filled?: boolean;
}

const Star: React.FC<StarIconProps> = ({
  className = "w-6 h-6",
  filled = false,
}) => (
  <svg
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
  </svg>
);

export default Star;
