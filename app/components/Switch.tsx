type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
};

const Switch = ({
  checked,
  onChange,
  label,
  disabled = false,
}: SwitchProps) => {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={() => onChange(!checked)}
          disabled={disabled}
        />
        <div
          className={`block w-14 h-8 rounded-full ${
            checked ? "bg-blue-600" : "bg-gray-300"
          } ${disabled ? "opacity-50" : ""}`}
        ></div>
        <div
          className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
            checked ? "transform translate-x-6" : ""
          }`}
        ></div>
      </div>
      {label && (
        <span
          className={`ml-3 text-sm font-medium ${disabled ? "text-gray-400" : "text-gray-900"}`}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default Switch;
