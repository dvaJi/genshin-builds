import { IoMdClose, IoMdSearch } from "react-icons/io";

type Props = {
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
};

const SearchInput = ({ value, setValue, placeholder }: Props) => {
  return (
    <div className="mx-3 flex h-10 items-center justify-start rounded-sm border border-gray-800 md:mx-0 md:w-72">
      <IoMdSearch className="mx-2 flex h-5 w-5 items-center justify-center" />
      <input
        className="h-full flex-grow border-0 bg-transparent text-white outline-none"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <IoMdClose
          className="mx-2 flex h-5 w-5 cursor-pointer items-center justify-center"
          onClick={() => setValue("")}
        />
      )}
    </div>
  );
};

export default SearchInput;
