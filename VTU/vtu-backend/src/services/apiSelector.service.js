import { buyDataVTpass } from "./vtpass.service.js";
import { buyDataClubKonnect } from "./clubkonnect.service.js";

export const buyDataFromAnyAPI = async (payload) => {
  const providers = [
    { name: "VTPASS", handler: buyDataVTpass },
    { name: "CLUBKONNECT", handler: buyDataClubKonnect },
  ];

  for (let provider of providers) {
    try {
      const response = await provider.handler(payload);

      if (response?.status === "success") {
        return {
          status: "success",
          provider: provider.name,
          response,
        };
      }
    } catch (error) {
      console.error(`${provider.name} failed:`, error.message);
    }
  }

  console.error("All VTU providers failed for payload:", payload);
  return { status: "failed" };
};
