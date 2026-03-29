import axios from "axios";
import crypto from "crypto";

const VTPASS_BASE_URL =
  process.env.VTPASS_ENV === "production"
    ? "https://api.vtpass.com/api"
    : "https://sandbox.vtpass.com/api";

const getAuthHeaders = () => {
  const credentials = Buffer.from(
    `${process.env.VTPASS_EMAIL}:${process.env.VTPASS_PASSWORD}`,
  ).toString("base64");

  return {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  };
};

const generateRequestId = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `${pad(now.getHours())}${pad(now.getMinutes())}` +
    crypto.randomBytes(4).toString("hex")
  );
};

// ─── AIRTIME ───────────────────────────────────────────────────────
export const buyAirtimeVTpass = async ({ phone, network, amount }) => {
  try {
    const serviceMap = {
      MTN: "mtn",
      GLO: "glo",
      AIRTEL: "airtel",
      "9MOBILE": "etisalat",
    };

    const serviceID = serviceMap[network];
    if (!serviceID) {
      return { status: "failed", message: `Unknown network: ${network}` };
    }

    const response = await axios.post(
      `${VTPASS_BASE_URL}/pay`,
      {
        request_id: generateRequestId(),
        serviceID,
        amount,
        phone,
      },
      { headers: getAuthHeaders() },
    );

    const data = response.data;
    const success =
      data?.code === "000" ||
      data?.content?.transactions?.status === "delivered";

    return {
      status: success ? "success" : "failed",
      message: data?.response_description || "Unknown response",
      raw: data,
    };
  } catch (error) {
    console.error("VTPASS AIRTIME ERROR:", error.message);
    return { status: "failed", message: error.message };
  }
};

// ─── DATA ──────────────────────────────────────────────────────────
export const buyDataVTpass = async ({ phone, serviceID, planCode, amount }) => {
  try {
    const response = await axios.post(
      `${VTPASS_BASE_URL}/pay`,
      {
        request_id: generateRequestId(),
        serviceID, // e.g. "mtn-data"
        billersCode: phone,
        variation_code: planCode, // e.g. "mtn-100mb-1000"
        amount,
        phone,
      },
      { headers: getAuthHeaders() },
    );

    const data = response.data;
    const success =
      data?.code === "000" ||
      data?.content?.transactions?.status === "delivered";

    return {
      status: success ? "success" : "failed",
      message: data?.response_description || "Unknown response",
      raw: data,
    };
  } catch (error) {
    console.error("VTPASS DATA ERROR:", error.message);
    return { status: "failed", message: error.message };
  }
};

// ─── CABLE ─────────────────────────────────────────────────────────
export const buyCableVTpass = async ({
  smartCardNumber,
  planCode,
  provider,
  amount,
}) => {
  try {
    const serviceMap = {
      DSTV: "dstv",
      GOTV: "gotv",
      STARTIMES: "startimes",
    };

    const response = await axios.post(
      `${VTPASS_BASE_URL}/pay`,
      {
        request_id: generateRequestId(),
        serviceID: serviceMap[provider] || provider.toLowerCase(),
        billersCode: smartCardNumber,
        variation_code: planCode,
        amount,
        phone: smartCardNumber,
      },
      { headers: getAuthHeaders() },
    );

    const data = response.data;
    const success =
      data?.code === "000" ||
      data?.content?.transactions?.status === "delivered";

    return {
      status: success ? "success" : "failed",
      message: data?.response_description || "Unknown response",
      raw: data,
    };
  } catch (error) {
    console.error("VTPASS CABLE ERROR:", error.message);
    return { status: "failed", message: error.message };
  }
};

// ─── ELECTRICITY ───────────────────────────────────────────────────
export const buyElectricityVTpass = async ({
  meterNumber,
  providerCode,
  meterType,
  amount,
  phone,
}) => {
  try {
    const response = await axios.post(
      `${VTPASS_BASE_URL}/pay`,
      {
        request_id: generateRequestId(),
        serviceID: providerCode,
        billersCode: meterNumber,
        variation_code: meterType,
        amount,
        phone,
      },
      { headers: getAuthHeaders() },
    );

    const data = response.data;
    const success =
      data?.code === "000" ||
      data?.content?.transactions?.status === "delivered";

    const token = data?.content?.transactions?.token || data?.token || null;
    const units = data?.content?.transactions?.units || data?.units || null;

    return {
      status: success ? "success" : "failed",
      message: data?.response_description || "Unknown response",
      token,
      units,
      raw: data,
    };
  } catch (error) {
    console.error("VTPASS ELECTRICITY ERROR:", error.message);
    return { status: "failed", message: error.message };
  }
};
