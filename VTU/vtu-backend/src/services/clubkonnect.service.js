import axios from "axios";

const BASE_URL = "https://www.nellobytesystems.com/";
const ENDPOINTS = {
  balance: "APIBalanceV1.asp",
  data: "APIDatabundleV1.asp",
  airtime: "APIBuyAirtimeV1.asp",
  tv: "APICableTVV1.asp",
  electricity: "APIElectricityV1.asp",
};

const getCredentials = () => ({
  UserID: process.env.CLUBKONNECT_USERID,
  APIKey: process.env.CLUBKONNECT_KEY,
});

// ─── AIRTIME ───────────────────────────────────────────────────────
export const buyAirtimeClubKonnect = async ({ phone, network, amount }) => {
  try {
    const networkMap = {
      MTN: "MTN",
      GLO: "GLO",
      AIRTEL: "AIRTEL",
      "9MOBILE": "9MOBILE",
    };

    const response = await axios.get(BASE_URL + ENDPOINTS.airtime, {
      params: {
        ...getCredentials(),
        MobileNetwork: networkMap[network] || network,
        Amount: amount,
        MobileNumber: phone,
        RequestID: Date.now().toString(),
        CallBackURL: "",
      },
    });

    const data = response.data;
    const success =
      data?.status === "success" ||
      data?.Status === "success" ||
      data?.retcode === "000";

    return {
      status: success ? "success" : "failed",
      message: data?.message || data?.Message || "Unknown response",
      raw: data,
    };
  } catch (error) {
    console.error("CLUBKONNECT AIRTIME ERROR:", error.message);
    return { status: "failed", message: error.message };
  }
};

// ─── DATA ──────────────────────────────────────────────────────────
export const buyDataClubKonnect = async ({ phone, planCode, amount }) => {
  try {
    const response = await axios.get(BASE_URL + ENDPOINTS.data, {
      params: {
        ...getCredentials(),
        DataPlan: planCode,
        MobileNumber: phone,
        RequestID: Date.now().toString(),
        CallBackURL: "",
      },
    });

    const data = response.data;
    const success =
      data?.status === "success" ||
      data?.Status === "success" ||
      data?.retcode === "000";

    return {
      status: success ? "success" : "failed",
      message: data?.message || data?.Message || "Unknown response",
      raw: data,
    };
  } catch (error) {
    console.error("CLUBKONNECT DATA ERROR:", error.message);
    return { status: "failed", message: error.message };
  }
};

// ─── CABLE ─────────────────────────────────────────────────────────
export const buyCableClubKonnect = async ({
  smartCardNumber,
  planCode,
  provider,
  amount,
}) => {
  try {
    const response = await axios.get(BASE_URL + ENDPOINTS.tv, {
      params: {
        ...getCredentials(),
        CableTV: provider,
        Package: planCode,
        SmartCardNo: smartCardNumber,
        RequestID: Date.now().toString(),
        CallBackURL: "",
      },
    });

    const data = response.data;
    const success =
      data?.status === "success" ||
      data?.Status === "success" ||
      data?.retcode === "000";

    return {
      status: success ? "success" : "failed",
      message: data?.message || data?.Message || "Unknown response",
      raw: data,
    };
  } catch (error) {
    console.error("CLUBKONNECT CABLE ERROR:", error.message);
    return { status: "failed", message: error.message };
  }
};

// ─── ELECTRICITY ───────────────────────────────────────────────────
export const buyElectricityClubKonnect = async ({
  meterNumber,
  providerCode,
  meterType,
  amount,
  phone,
}) => {
  try {
    const response = await axios.get(BASE_URL + ENDPOINTS.electricity, {
      params: {
        ...getCredentials(),
        ElectricCompany: providerCode,
        MeterType: meterType,
        MeterNumber: meterNumber,
        Amount: amount,
        MobileNumber: phone,
        RequestID: Date.now().toString(),
        CallBackURL: "",
      },
    });

    const data = response.data;
    const success =
      data?.status === "success" ||
      data?.Status === "success" ||
      data?.retcode === "000";

    const token = data?.Token || data?.token || null;
    const units = data?.Units || data?.units || null;

    return {
      status: success ? "success" : "failed",
      message: data?.message || data?.Message || "Unknown response",
      token,
      units,
      raw: data,
    };
  } catch (error) {
    console.error("CLUBKONNECT ELECTRICITY ERROR:", error.message);
    return { status: "failed", message: error.message };
  }
};