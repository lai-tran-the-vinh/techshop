import { useState, useEffect, useRef } from "react";
import {
  AiFillEye,
  AiFillWarning,
  AiOutlineClose,
  AiFillEyeInvisible,
} from "react-icons/ai";
import Users from "@services/users";
import { useAppContext } from "@contexts";

function Signup() {
  useEffect(() => {
    document.title = "TechShop | Đăng ký";
  }, []);

  const genderDropdownRef = useRef(null);
  const [user, setUser] = useState({
    phone: "",
    email: "",
    gender: "",
    address: "",
    fullName: "",
    password: "",
  });

  const genders = ["Nam", "Nữ", "Khác"];
  const { setShowSignup } = useAppContext();

  const [userError, setUserError] = useState({
    emailError: false,
    phoneError: false,
    genderError: false,
    addressError: false,
    fullNameError: false,
    passwordError: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        genderDropdownRef.current &&
        !genderDropdownRef.current.contains(event.target)
      ) {
        setShowGenderDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-screen h-screen font-roboto bg-[rgba(0,0,0,0.05)] flex items-center justify-center backdrop-blur-sm fixed top-0 right-0 bottom-0 left-0">
      <div className="xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[80%] w-[90%] bg-white rounded-lg">
        <div className="border-b border-b-gray-200 rounded-t-lg flex justify-between items-center px-20 h-50">
          <h3 className="font-medium text-xl">Đăng ký</h3>
          <div
            onClick={() => setShowSignup(false)}
            className="w-40 h-40 text-xl font-light flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
          >
            <AiOutlineClose />
          </div>
        </div>
        <form className="px-20">
          <div className="flex flex-col my-10">
            <label htmlFor="fullName" className="text-sm font-medium mb-4">
              Họ và tên
            </label>
            <input
              id="fullName"
              type="fullName"
              name="fullName"
              placeholder="Nhập họ và tên"
              onChange={(event) => {
                const fieldName = event.target.name;
                setUser({ ...user, [fieldName]: event.target.value });
              }}
              className="outline-none text-base placeholder:text-sm rounded-md px-12 py-8 bg-gray-100"
            />
            {userError.fullNameError && (
              <div className="flex items-center gap-2">
                <div className="text-red-500">
                  <AiFillWarning />
                </div>
                <span className="text-sm mt-2 text-red-500">
                  Họ và tên không được để trống hoặc bao gồm số
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-10 my-10">
            <div className="flex flex-col w-[70%]">
              <label htmlFor="phone" className="text-sm font-medium mb-4">
                Số điện thoại
              </label>
              <input
                id="phone"
                type="phone"
                name="phone"
                placeholder="Nhập số điện thoại"
                onChange={(event) => {
                  const fieldName = event.target.name;
                  setUser({ ...user, [fieldName]: event.target.value });
                }}
                className="outline-none text-base placeholder:text-sm rounded-md px-12 py-8 bg-gray-100"
              />
              {userError.phoneError && (
                <div className="flex items-center gap-2">
                  <div className="text-red-500">
                    <AiFillWarning />
                  </div>
                  <span className="text-sm mt-2 text-red-500">
                    Số điện thoại không hợp lệ
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col relative">
              <label htmlFor="gender" className="text-sm font-medium mb-4">
                Giới tính
              </label>
              <input
                readOnly
                id="gender"
                type="gender"
                value={user.gender}
                name="gender"
                placeholder="Chọn giới tính"
                onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                className="outline-none text-base placeholder:text-sm cursor-pointer rounded-md px-12 py-8 bg-gray-100"
              />

              {showGenderDropdown && (
                <ul
                  ref={genderDropdownRef}
                  className="absolute left-0 right-0 top-full rounded-md mt-4 p-4 bg-gray-100"
                >
                  {genders.map((gender) => (
                    <li
                      onClick={(event) => {
                        setUser({ ...user, gender: event.target.textContent });
                        setShowGenderDropdown(false);
                      }}
                      className={`px-8 py-2 cursor-pointer ${user.gender === gender ? "bg-gray-200" : ""}`}
                    >
                      {gender}
                    </li>
                  ))}
                </ul>
              )}

              {userError.genderError && (
                <div className="flex items-center gap-2">
                  <div className="text-red-500">
                    <AiFillWarning />
                  </div>
                  <span className="text-sm mt-2 text-red-500">
                    Vui lòng chọn giới tính
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col my-10">
            <label htmlFor="address" className="text-sm font-medium mb-4">
              Địa chỉ
            </label>
            <input
              id="address"
              type="address"
              name="address"
              placeholder="Nhập địa chỉ"
              onChange={(event) => {
                const fieldName = event.target.name;
                setUser({ ...user, [fieldName]: event.target.value });
              }}
              className="outline-none text-base placeholder:text-sm rounded-md px-12 py-8 bg-gray-100"
            />
            {userError.addressError && (
              <div className="flex items-center gap-2">
                <div className="text-red-500">
                  <AiFillWarning />
                </div>
                <span className="text-sm mt-2 text-red-500">
                  Vui lòng chọn địa chỉ
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col my-10">
            <label htmlFor="email" className="text-sm font-medium mb-4">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Nhập email"
              onChange={(event) => {
                const fieldName = event.target.name;
                setUser({ ...user, [fieldName]: event.target.value });
              }}
              className="outline-none text-base placeholder:text-sm rounded-md px-12 py-8 bg-gray-100"
            />
            {userError.emailError && (
              <div className="flex items-center gap-2">
                <div className="text-red-500">
                  <AiFillWarning />
                </div>
                <span className="text-sm mt-2 text-red-500">
                  Email không đúng
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col mb-10">
            <label htmlFor="password" className="text-sm font-medium mb-4">
              Mật khẩu
            </label>
            <div className="rounded-md w-full relative">
              <input
                id="password"
                name="password"
                placeholder="Nhập mật khẩu"
                type={showPassword ? "text" : "password"}
                onChange={(event) => {
                  const fieldName = event.target.name;
                  setUser({ ...user, [fieldName]: event.target.value });
                }}
                className="outline-none w-full text-base placeholder:text-sm rounded-md px-12 py-8 bg-gray-100"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-10 top-[50%] -translate-y-[50%]"
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </div>
            </div>
            {userError.passwordError && (
              <div className="flex items-center gap-2">
                <div className="text-red-500">
                  <AiFillWarning />
                </div>
                <span className="text-sm mt-2 text-red-500">
                  Mật khẩu tối thiểu 8 ký tự và không được chứa khoảng trắng
                </span>
              </div>
            )}
          </div>
          <div className="my-30 flex flex-col items-center">
            <button
              onClick={(event) => {
                event.preventDefault();
              }}
              className="bg-primary w-full cursor-pointer hover:opacity-80 py-6 rounded-md text-white"
            >
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
