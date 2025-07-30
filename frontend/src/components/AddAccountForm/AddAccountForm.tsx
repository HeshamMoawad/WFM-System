import { FC, useState } from "react";
import SelectComponent from "../SelectComponent/SelectComponent";
import { Project } from "../../types/auth";

// AddAccountForm Component
const AddAccountForm: FC<{
    onAdd: (name: string) => void;
  }> = ({ onAdd }) => {
    const [name, setName] = useState("");
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (name.trim()) {
        onAdd(name);
        setName("");
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-3 gap-1 border-t border-[gray] pt-3">
        <label htmlFor="project" className='place-self-center' >Phone Number</label>
        <input
          type="text"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          placeholder="number like +201500000000"
          className="col-span-2 rounded-lg focus:outline-none"
        />
        <SelectComponent<Project>
            name="project" 
            LabelName="Project"
            url="api/users/project"
            selectClassName="col-span-2" 
            LabelClassName='col-span-1 place-self-center'
            config={{value: "uuid",label:"name"}}
            required={true}
            
        />
        <button 
          type="submit"
          className="col-span-3 min-h-8 w-full place-self-center bg-[#25D366] text-white rounded-lg hover:bg-green-500 transition min-w-[40px]"
        >
          Add
        </button>
      </form>
    );
  };
  

export default AddAccountForm;