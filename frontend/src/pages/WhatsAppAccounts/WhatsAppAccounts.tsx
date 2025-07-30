import { FC, useState } from "react";
import { Account } from "../../types/base";
import AccountItem from "../../components/AccountItem/AccountItem";
import AddAccountForm from "../../components/AddAccountForm/AddAccountForm";
import AddPhoneNumberForm from "../../components/AddPhoneNumberForm/AddPhoneNumberForm";
import PhoneNumberItem from "../../components/PhoneNumberItem/PhoneNumberItem";
import { WHATSAPP_COLORS } from "../../utils/constants";
import QRCode from "react-qr-code";
import tempImage from "../../assets/images/like.webp";


// Main Component
const WhatsAppAccounts: FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([
      {
        id: "1",
        name: "Business Account",
        phoneNumbers: [
          { id: "1-1", number: "+1234567890", verified: true },
          { id: "1-2", number: "+1987654321", verified: false }
        ]
      },
      {
        id: "2",
        name: "Personal Account",
        phoneNumbers: [
          { id: "2-1", number: "+1122334455", verified: true }
        ]
      }
    ]);
    const [qr,setQR] = useState<string|null>(null);
    
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>("1");
  
    const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);
  
    const handleAddAccount = (name: string) => {
      const newAccount: Account = {
        id: Date.now().toString(),
        name,
        phoneNumbers: []
      };
      setAccounts([...accounts, newAccount]);
    };
  
    const handleAddPhoneNumber = (number: string) => {
      if (!selectedAccountId) return;
      
      setAccounts(accounts.map(acc => 
        acc.id === selectedAccountId
          ? {
              ...acc,
              phoneNumbers: [
                ...acc.phoneNumbers,
                {
                  id: `${acc.id}-${Date.now()}`,
                  number,
                  verified: false
                }
              ]
            }
          : acc
      ));
    };
  
    const handleRemovePhoneNumber = (numberId: string) => {
      setAccounts(accounts.map(acc => 
        acc.id === selectedAccountId
          ? {
              ...acc,
              phoneNumbers: acc.phoneNumbers.filter(num => num.id !== numberId)
            }
          : acc
      ));
    };
    return (
      <div className="grid grid-cols-8 h-full gap-4 px-4 justify-center">
        {/* Sidebar */}
        <div className={`col-span-2 border border-[${WHATSAPP_COLORS.primary}] bg-light-colors-dashboard-secondry-bg dark:bg-dark-colors-dashboard-secondry-bg p-4 flex flex-col rounded-lg h-fit`}
        >
          <h2 className="text-xl font-bold text-white mb-4">Accounts</h2>
          
          <div className="flex-1 overflow-y-auto">
            {accounts.map(account => (
              <AccountItem
                key={account.id}
                account={account}
                isSelected={account.id === selectedAccountId}
                onClick={() => setSelectedAccountId(account.id)}
              />
            ))}
          </div>
          
          <AddAccountForm onAdd={handleAddAccount} />
        </div>
  
        {/* Main Content */}
        <div className={` col-span-4 justify-evenly gap-4 p-4 h-fit w-full justify-center rounded-lg border border-[${WHATSAPP_COLORS.primary}] `}
        >
          <div className="max-w-3xl min-w-[50%]">
            <h1 className="text-3xl font-bold mb-6" >
              WhatsApp Manager
            </h1>
            
            {selectedAccount ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">{selectedAccount.name}</h2>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Active
                  </span>
                </div>
                
                <h3 className="text-xl font-medium mb-4">Registered Phone Numbers</h3>
                
                {selectedAccount.phoneNumbers.length > 0 ? (
                  <div className="mb-6">
                    {selectedAccount.phoneNumbers.map(number => (
                      <PhoneNumberItem
                        key={number.id}
                        number={number}
                        onRemove={handleRemovePhoneNumber}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="mb-6 text-gray-500">No phone numbers registered</p>
                )}
                
                <AddPhoneNumberForm onAdd={handleAddPhoneNumber} />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">Select an account to manage phone numbers</p>
              </div>
            )}
          </div>
        </div>
        <div className={`col-span-2 h-fit w-full flex justify-center p-8 rounded-lg border border-[${WHATSAPP_COLORS.primary}]`}>
          {
            qr ? <QRCode value={qr} /> : <img src={tempImage} alt="" />
          }
          
        </div>
      </div>
    );
  };
  
  export default WhatsAppAccounts;
  