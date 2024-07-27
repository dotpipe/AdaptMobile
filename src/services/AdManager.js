// mobile/AdaptMobile/AdaptMobile/src/services/AdManager.js
export class AdManager {
  async getAdsForLocation(zipCode) {
    try {
      const response = await fetch(`https://your-api-endpoint.com/ads?zipCode=${zipCode}`);
      const ads = await response.json();
      return ads;
    } catch (error) {
      console.error('Error fetching ads:', error);
      return [];
    }
  }
}