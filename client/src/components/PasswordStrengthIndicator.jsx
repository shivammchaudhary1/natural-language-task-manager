import React from "react";
import { checkPasswordStrength } from "@/lib/validation";

const PasswordStrengthIndicator = ({ password, name }) => {
  if (!password) return null;

  const { strength, color, percentage, checks } = checkPasswordStrength(
    password,
    name
  );

  const missingRequirements = [];
  if (!checks.length) missingRequirements.push("8+ characters");
  if (!checks.uppercase) missingRequirements.push("uppercase letter");
  if (!checks.lowercase) missingRequirements.push("lowercase letter");
  if (!checks.number) missingRequirements.push("number");
  if (!checks.special) missingRequirements.push("special character");
  if (!checks.notCommon) missingRequirements.push("avoid common passwords");
  if (!checks.notName) missingRequirements.push("avoid using your name");

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-midnight-blue/70">
          Password strength:
        </span>
        <span
          className={`text-sm font-medium ${
            color === "green"
              ? "text-green-600"
              : color === "yellow"
              ? "text-yellow-600"
              : color === "orange"
              ? "text-orange-600"
              : "text-red-600"
          }`}
        >
          {strength}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${
            color === "green"
              ? "bg-green-600"
              : color === "yellow"
              ? "bg-yellow-600"
              : color === "orange"
              ? "bg-orange-600"
              : "bg-red-600"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Feedback */}
      {missingRequirements.length > 0 && (
        <div className="text-xs text-midnight-blue/60">
          <span>Missing: </span>
          <span>{missingRequirements.join(", ")}</span>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
