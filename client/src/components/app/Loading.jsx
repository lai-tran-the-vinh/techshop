import { AiFillCheckCircle, AiOutlineClose } from "react-icons/ai";

function SuccessToast() {
  return (
    <div className="bg-green-200 relative border border-green-500 flex items-center justify-center gap-6 w-[20%] h-60 mt-20 rounded-lg">
      <div className="text-xl text-green-700">
        <AiFillCheckCircle />
      </div>
      <span className="text-green-700">Đăng nhập thành công</span>
      <div className="absolute top-0 right-0 p-6 cursor-pointer text-green-700">
        <AiOutlineClose />
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 flex justify-center">
      <SuccessToast />
    </div>
  );
}

export default Loading;
