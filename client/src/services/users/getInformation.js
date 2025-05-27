import axios from "axios";

async function getInformation() {
  try {
    if (!localStorage.getItem("token")) {
      throw new Error("Không tìm thấy token, vui lòng đăng nhập lại.");
    }
    const response = await axios.get("/api/users/information", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {}
}

export default getInformation;
