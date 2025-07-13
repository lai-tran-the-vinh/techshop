import upload from './upload';

import axiosInstance from '@services/apis';

class Files {
  static upload = upload;
  static async callDelete(url) {
    const params = { url };

    return await axiosInstance.delete(`/api/v1/upload/image`, { params });
  }
};


export default Files;
