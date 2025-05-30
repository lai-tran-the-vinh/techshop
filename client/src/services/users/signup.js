import axios from "axios";

import {
  validateEmail,
  validatePhone,
  validateAddress,
  validatePassword,
  validateFullname,
} from "@helpers";

async function signup(
  user,
  userError,
  setMessage,
  setUserError,
  setToastLoading,
  setLoadingError,
  setLoadingSuccess
) {
  const newUserError = { ...userError };
  var hasError = false;

  if (validateFullname(user.fullName)) {
    newUserError.fullNameError = false;
  } else {
    newUserError.fullNameError = true;
    hasError = true;
  }

  if (validateAddress(user.address)) {
    newUserError.addressError = false;
  } else {
    newUserError.addressError = true;
    hasError = true;
  }

  if (validatePhone(user.phone)) {
    newUserError.phoneError = false;
  } else {
    newUserError.phoneError = true;
    hasError = true;
  }

  if (user.gender !== "") {
    newUserError.genderError = false;
  } else {
    newUserError.genderError = true;
    hasError = true;
  }

  if (validateEmail(user.email)) {
    newUserError.emailError = false;
  } else {
    newUserError.emailError = true;
    hasError = true;
  }

  if (validatePassword(user.password)) {
    newUserError.passwordError = false;
  } else {
    newUserError.passwordError = true;
    hasError = true;
  }

  setUserError(newUserError);

  if (!hasError) {
    setToastLoading(true);
    setMessage("Đang đăng ký.");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/register`,
        {
          name: user.fullName,
          address: user.address,
          phone: user.phone,
          gender: user.gender,
          email: user.email,
          password: user.password,
        }
      );

      if (response.data.statusCode === 201) {
        setToastLoading(false);
        setLoadingSuccess(true);
        setMessage("Đăng ký thành công.");
      }
      setToastLoading(false);
    } catch (error) {
      setToastLoading(false);
      setLoadingError(true);
      setMessage("Đăng ký thất bại.");
    }
  }
}

export default signup;
