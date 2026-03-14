import axios from "axios";

export const buyDataClubKonnect = async ({
  phone,
  planCode,
  amount,
  reference,
}) => {
  try {
    const response = await axios.post(
      "https://www.clubkonnect.com/api/data",
      {
        network: planCode,
        mobile: phone,
        amount,
        request_id: reference,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLUBKONNECT_KEY}`,
        },
      },
    );

    const data = response.data;
    return {
      status: data.status === "00" ? "success" : "failed",
      raw: data,
    };
  } catch (error) {
    return {
      status: "failed",
      message: error.message,
    };
  }
};
