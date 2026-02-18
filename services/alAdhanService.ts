import { AlAdhanResponse } from '../types';

const BASE_URL = 'https://api.aladhan.com/v1';

export const getTimingsByCity = async (city: string, country: string): Promise<AlAdhanResponse> => {
  try {
    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    
    // Using timingsByCity endpoint
    const response = await fetch(
      `${BASE_URL}/timingsByCity/${dateStr}?city=${city}&country=${country}&method=1&school=1`
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

export const getTimingsByCoordinates = async (lat: number, lng: number): Promise<AlAdhanResponse> => {
  try {
    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    
    // Using timings endpoint for coordinates
    const response = await fetch(
      `${BASE_URL}/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=1&school=1`
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    return data as AlAdhanResponse;
  } catch (error) {
    console.error("Failed to fetch timings by coordinates:", error);
    throw error;
  }
};