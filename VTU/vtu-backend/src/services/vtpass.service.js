import axios from "axios";
import { raw } from "express";

export const buyDataVTpass = async ({ phone, planCode, amount, reference }) => {
  try {
    const auth = Buffer.from(
      `${process.env.VTPASS_EMAIL}:${process.env.VTPASS_PASSWORD}`,
    ).toString("base64");

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
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = response.data;
    return {
      status: data.code === "000" ? "success" : "failed",
      raw: data,
    };
  } catch (error) {
    return {
      status: "failed",
      message: error.message,
    };
  }
};
