 import { FC, useState } from 'react';
import { Contact } from 'whatsapp-web.js';
import { getSocket } from '../../services/socket';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    contacts: Contact[];
}

const CreateGroupModal: FC<CreateGroupModalProps> = ({ isOpen, onClose, contacts }) => {
    const [groupName, setGroupName] = useState('');
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

    const handleContactToggle = (contactId: string) => {
        setSelectedContacts(prev =>
            prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]
        );
    };

    const handleCreateGroup = () => {
        if (groupName.trim() && selectedContacts.length > 0) {
            const socket = getSocket();
            if (socket) {
                socket.emit('createGroup', { groupName, contactIds: selectedContacts });
                onClose();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
                <input
                    type="text"
                    placeholder="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">Select Participants</h3>
                <div className="max-h-60 overflow-y-auto border rounded-md p-2 mb-4">
                    {contacts.map(contact => (
                        <div key={contact.id._serialized} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md">
                            <input
                                type="checkbox"
                                checked={selectedContacts.includes(contact.id._serialized)}
                                onChange={() => handleContactToggle(contact.id._serialized)}
                                className="h-5 w-5"
                            />
                            <span>{contact.name || contact.id.user}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="p-2 bg-gray-300 text-black rounded hover:bg-gray-400">
                        Cancel
                    </button>
                    <button onClick={handleCreateGroup} className="p-2 bg-green-500 text-white rounded hover:bg-green-600" disabled={!groupName.trim() || selectedContacts.length === 0}>
                        Create Group
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;
