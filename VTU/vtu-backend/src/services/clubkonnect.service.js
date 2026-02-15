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
      }
    );

    return response.data;
  } catch (error) {
    return {
      status: "failed",
      error: error.message,
    };
  }
};
