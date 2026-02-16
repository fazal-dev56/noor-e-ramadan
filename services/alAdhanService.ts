import { AlAdhanResponse } from "../types";

const BASE_URL = "https://api.aladhan.com/v1";

export const getTimingsByCity = async (
  city: string,
  country: string,
): Promise<AlAdhanResponse> => {
  try {
    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

    // Using timingsByCity endpoint
    const response = await fetch(
      `${BASE_URL}/timingsByCity/${dateStr}?city=${city}&country=${country}&method=1&school=1`,
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    return data as AlAdhanResponse;
  } catch (error) {
    console.error("Failed to fetch timings:", error);
    throw error;
  }
};
