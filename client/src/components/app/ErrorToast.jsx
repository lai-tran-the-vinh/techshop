import { useAppContext, useEffect } from "@contexts";
import { AiFillCheckCircle, AiOutlineClose } from "react-icons/ai";

function ErrorToast() {
  const { message, setLoadingError } = useAppContext();
  useEffect(() => {
    const id = setTimeout(() => {
      setLoadingError(false);
    }, 3000);

    return () => {
      clearTimeout(id);
    };
  }, []);

  return (
    <div className="bg-red-200 relative border border-red-500 flex items-center justify-center gap-6 w-[20%] h-60 mt-20 rounded-lg">
      <div className="text-xl text-red-700">
        <AiFillCheckCircle />
      </div>
      <span className="text-red-700">{message}</span>
      <div
        onClick={() => {
          setLoadingError(false);
        }}
        className="absolute top-0 right-0 p-6 cursor-pointer text-red-700"
      >
        <AiOutlineClose />
      </div>
    </div>
  );
}

export default ErrorToast;
