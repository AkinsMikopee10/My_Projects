import {
  buyAirtimeVTpass,
  buyDataVTpass,
  buyCableVTpass,
  buyElectricityVTpass,
} from "./vtpass.service.js";

import {
  buyAirtimeClubKonnect,
  buyDataClubKonnect,
  buyCableClubKonnect,
  buyElectricityClubKonnect,
} from "./clubkonnect.service.js";

const withFallback = async (providers, payload) => {
  for (const provider of providers) {
    try {
      console.log(`Trying provider: ${provider.name}`);
      const response = await provider.handler(payload);
      if (response?.status === "success") {
        console.log(`Success with provider: ${provider.name}`);
        return { ...response, provider: provider.name };
      }
      console.log(`Provider ${provider.name} failed:`, response?.message);
    } catch (error) {
      console.error(`Provider ${provider.name} threw error:`, error.message);
    }
  }
  console.error("All providers failed for payload:", payload);
  return { status: "failed", message: "All providers failed" };
};

export const buyAirtimeFromAnyAPI = (payload) =>
  withFallback(
    [
      { name: "VTPASS", handler: buyAirtimeVTpass },
      { name: "CLUBKONNECT", handler: buyAirtimeClubKonnect },
    ],
    payload
  );

export const buyDataFromAnyAPI = (payload) =>
  withFallback(
    [
      { name: "VTPASS", handler: buyDataVTpass },
      { name: "CLUBKONNECT", handler: buyDataClubKonnect },
    ],
    payload
  );

export const buyCableFromAnyAPI = (payload) =>
  withFallback(
    [
      { name: "VTPASS", handler: buyCableVTpass },
      { name: "CLUBKONNECT", handler: buyCableClubKonnect },
    ],
    payload
  );

export const buyElectricityFromAnyAPI = (payload) =>
  withFallback(
    [
      { name: "VTPASS", handler: buyElectricityVTpass },
      { name: "CLUBKONNECT", handler: buyElectricityClubKonnect },
    ],
    payload
  );