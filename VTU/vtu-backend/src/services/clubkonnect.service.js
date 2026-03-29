import axios from "axios";

const BASE_URL = "https://www.clubkonnect.com/api/v1";

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

    const response = await axios.post(`${BASE_URL}/airtime/`, {
      ...getCredentials(),
      MobileNetwork: networkMap[network] || network,
      Amount: amount,
      MobileNumber: phone,
      RequestID: Date.now().toString(),
    });

    const data = response.data;
    const success = data?.Status === "success" || data?.status === "success";

    return {
      status: success ? "success" : "failed",
      message: data?.Message || data?.message || "Unknown response",
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
    const response = await axios.post(`${BASE_URL}/data/`, {
      ...getCredentials(),
      DataPlan: planCode,
      MobileNumber: phone,
      RequestID: Date.now().toString(),
    });

    const data = response.data;
    const success = data?.Status === "success" || data?.status === "success";

    return {
      status: success ? "success" : "failed",
      message: data?.Message || data?.message || "Unknown response",
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
    const response = await axios.post(`${BASE_URL}/cabletv/`, {
      ...getCredentials(),
      CableTVNetwork: provider,
      CableTVPackage: planCode,
      SmartCardNumber: smartCardNumber,
      RequestID: Date.now().toString(),
    });

    const data = response.data;
    const success = data?.Status === "success" || data?.status === "success";

    return {
      status: success ? "success" : "failed",
      message: data?.Message || data?.message || "Unknown response",
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
    const response = await axios.post(`${BASE_URL}/electricity/`, {
      ...getCredentials(),
      ElectricCompany: providerCode,
      MeterType: meterType,
      MeterNumber: meterNumber,
      Amount: amount,
      MobileNumber: phone,
      RequestID: Date.now().toString(),
    });

    const data = response.data;
    const success = data?.Status === "success" || data?.status === "success";

    const token =
      data?.Token || data?.token || null;

    const units =
      data?.Units || data?.units || null;

    return {
      status: success ? "success" : "failed",
      message: data?.Message || data?.message || "Unknown response",
      token,
      units,
      raw: data,
    };
  } catch (error) {
    console.error("CLUBKONNECT ELECTRICITY ERROR:", error.message);
    return { status: "failed", message: error.message };
  }
};