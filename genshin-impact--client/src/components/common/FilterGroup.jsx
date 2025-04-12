const FilterGroup = ({ title, options, selectedValue, onChange }) => {
  return (
    <div className="mb-4">
      {title && (
        <h3 className="text-white text-sm font-medium mb-2">{title}</h3>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${
                  selectedValue === option.value
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            style={
              option.color
                ? {
                    backgroundColor:
                      selectedValue === option.value ? option.color : undefined,
                  }
                : {}
            }
          >
            {option.icon && (
              <img src={option.icon} alt="" className="w-4 h-4 inline mr-1" />
            )}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;
