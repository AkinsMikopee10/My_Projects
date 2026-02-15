import axios from "axios";

export const buyDataVTpass = async ({ phone, planCode, amount, reference }) => {
  try {
    const response = await axios.post(
      "https://api.vtpass.com/api/pay",
      {
        serviceID: planCode,
        phone,
        request_id: reference,
        amount,
      },
      {
        headers: {
          Authorization: `Basic ${process.env.VTPASS_AUTH}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    return {
      status: "failed",
      message: error.message,
    };
  }
};
