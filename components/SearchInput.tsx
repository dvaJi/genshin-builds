import { IoMdSearch, IoMdClose } from "react-icons/io";

type Props = {
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
};

const SearchInput = ({ value, setValue, placeholder }: Props) => {
  return (
    <div className="flex items-center justify-start border border-gray-800 rounded-sm h-10 mx-3 md:mx-0 md:w-72">
      <IoMdSearch className="flex items-center justify-center w-5 h-5 mx-2" />
      <input
        className="flex-grow h-full text-white border-0 outline-none bg-transparent"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <IoMdClose
          className="flex items-center justify-center w-5 h-5 cursor-pointer mx-2"
          onClick={() => setValue("")}
        />
      )}
    </div>
  );
};

export default SearchInput;
