const Badge = ({ text, color, icon, size = "md" }) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-base",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: color ? `${color}20` : "#3949AB20",
        color: color || "#3949AB",
      }}
    >
      {icon && <img src={icon} alt="" className="w-4 h-4 mr-1" />}
      {text}
    </span>
  );
};

export default Badge;
