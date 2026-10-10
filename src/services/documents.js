import { axiosFireApi } from "./config";

const DOCUMENTS_KEY = "aidip_documents";

export const getStoredDocuments = () => {
  try {
    const raw = localStorage.getItem(DOCUMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const storeDocuments = (documents) => {
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
};

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axiosFireApi("/documents/upload", "post", formData);
};

export const askDocument = async (documentId, question) => {
  return axiosFireApi(`/documents/${documentId}/ask`, "post", {}, {
    params: { question },
  });
};

export const extractAnswer = (payload) => {
  if (payload == null) return "No answer returned.";
  if (typeof payload === "string") return payload;

  return (
    payload.answer ||
    payload.response ||
    payload.result ||
    payload.message ||
    payload.data?.answer ||
    payload.data?.response ||
    JSON.stringify(payload, null, 2)
  );
};
