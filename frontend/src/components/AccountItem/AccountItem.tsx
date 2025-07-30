import { FC } from "react";
import { Account } from "../../types/base";

// AccountItem Component
const AccountItem: FC<{
    account: Account;
    isSelected: boolean;
    onClick: () => void;
  }> = ({ account, isSelected, onClick }) => (

    <div 
      onClick={onClick}
      className={`flex justify-between items-center p-3 rounded-lg mb-2 cursor-pointer transition-all shadow-md hover:bg-[#9dc8c3] ${
        isSelected 
          ? "bg-[#075E54] text-[white] " 
          : ""
      }`}
    >
      <div>
        <h3 className="font-semibold">{account.name}</h3>
        <p className="text-sm opacity-80">
          {account.phoneNumbers.length} registered numbers
        </p>
        
      </div>
      <button className="text-sm bg-btns-colors-secondry rounded-lg p-2">Delete</button>
    </div>
  );
  
export default AccountItem;