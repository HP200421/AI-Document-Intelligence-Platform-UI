import axios from "axios";
import { toast } from "react-toastify";
import { handleLogout } from "../pages/auth/common/store";
import store from "../store/index";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ACCESS_TOKEN_KEY = "access_token";

const API = {
  register: "/users/",
  login: "/auth/login",
  logout: "/auth/logout",
  refresh: "/auth/refresh",
  uploadDocument: "/documents/upload",
};

const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

const getAPIUrl = (url) => {
  if (Array.isArray(url)) {
    const [key, ...parts] = url;

    return `${API[key]}/${parts.join("/")}/`;
  }

  return API[url] || url;
};

const axioInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

axioInstance.interceptors.request.use(
  (request) => {
    request.url = getAPIUrl(request.url);

    const token = getAccessToken();
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);


axioInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },

  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      /*
       * Don't try to refresh if the failed request itself
       * was the refresh request.
       */
      if (originalRequest.url?.includes(API.refresh)) {
        store.dispatch(handleLogout());

        toast.error("Session expired, please login again");

        window.location.href = "/";

        return Promise.reject(error);
      }

      /*
       * If refresh is already running,
       * put this request into the queue.
       */
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return axioInstance(originalRequest);
        });
      }

      /*
       * Mark this request so it cannot retry infinitely.
       */
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        /*
         * Refresh token is sent automatically through
         * the HttpOnly cookie because of withCredentials.
         */
        const response = await axioInstance.post(API.refresh);

        const newAccessToken = response.access_token;

        if (!newAccessToken) {
          throw new Error("Access token was not returned");
        }

        /*
         * Save new access token.
         */
        setAccessToken(newAccessToken);

        /*
         * Resolve all queued requests.
         */
        processQueue(null, newAccessToken);

        /*
         * Retry the original request.
         */
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axioInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        store.dispatch(handleLogout());

        toast.error("Session expired, please login again");

        window.location.href = "/";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) {
      toast.error("You are not authorized to perform this action");
    } else if (status === 404) {
      toast.error("Page Not Found");
    } else if (status === 400) {
      toast.error(
        error.response?.data?.error?.message ||
        "Bad request",
      );
    } else if (status === 405) {
      toast.error("Method Not Allowed");
    } else if (status >= 500) {
      toast.error("Internal Server Error");
    } else if (status > 400 && status < 500) {
      toast.error("Something went wrong");
    }

    return Promise.reject(error);
  },
);

const axiosFireApi = async (url, method = "get", data = {}, config = {}) => {
  method = method.toLowerCase();

  const allData = {
    url,
    method,
    ...config,
  };

  if (method === "get" || method === "delete") {
    allData.params = { ...(config.params || {}), ...data };
  } else if (
    method === "post" ||
    method === "patch" ||
    method === "put"
  ) {
    allData.data = data;
  }

  try {
    const result = await axioInstance(allData);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.response?.data ||
        error.message,
    };
  }
};

let controller;

const singalAxios = async (url, params) => {
  if (controller) {
    controller.abort();
  }

  controller = new AbortController();

  try {
    const result = await axioInstance({
      method: "GET",
      url,
      params,
      signal: controller.signal,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.message,
    };
  }
};

export {
  API_URL,
  axioInstance,
  axiosFireApi,
  singalAxios,
  setAccessToken,
  getAccessToken,
};