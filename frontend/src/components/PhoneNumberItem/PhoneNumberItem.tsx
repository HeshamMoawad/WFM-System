import { FC } from "react";
import { PhoneNumber } from "../../types/base";

// PhoneNumberItem Component
const PhoneNumberItem: FC<{
    number: PhoneNumber;
    onRemove: (id: string) => void;
  }> = ({ number, onRemove }) => (
    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow mb-2">
      <div>
        <p className="font-medium">{number.number}</p>
        <span className={`text-xs px-2 py-1 rounded-full ${
          number.verified 
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {number.verified ? "Verified" : "Pending"}
        </span>
      </div>
      <button 
        onClick={() => onRemove(number.id)}
        className="text-red-500 hover:text-red-700"
      >
        Remove
      </button>
    </div>
  );
  

export default PhoneNumberItem;
