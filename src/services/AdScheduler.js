import { Database } from './Database';

export class AdScheduler {
  constructor() {
    this.db = new Database();
  }

  async scheduleAd(content, startDate, endDate, selectedHours, dailyBudget, zipCode) {
    if (endDate - startDate > 28 * 24 * 60 * 60 * 1000) {
      throw new Error('Ad duration cannot exceed 28 days');
    }

    const adId = await this.db.execute('INSERT INTO ads (content, target_zipcode) VALUES (?, ?)', [content, zipCode]);

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      for (let hour of selectedHours) {
        const scheduledTime = new Date(currentDate.setHours(hour, 0, 0, 0));
        await this.db.execute(
          'INSERT INTO ad_schedule (ad_id, scheduled_time, budget) VALUES (?, ?, ?)',
          [adId, scheduledTime.toISOString(), dailyBudget / selectedHours.length]
        );
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  async cancelAd(adId, scheduledTime) {
    const currentTime = new Date();
    const scheduleTime = new Date(scheduledTime);

    if (scheduleTime - currentTime < 3 * 60 * 60 * 1000) {
      throw new Error('Ads can only be cancelled at least 3 hours before scheduled time');
    }

    await this.db.execute('DELETE FROM ad_schedule WHERE ad_id = ? AND scheduled_time = ?', [adId, scheduledTime]);
  }

  async getActiveAds(zipCode, currentTime) {
    return await this.db.query(
      `SELECT a.ad_id, a.content, a.target_zipcode, s.budget
       FROM ads a
       JOIN ad_schedule s ON a.ad_id = s.ad_id
       WHERE a.target_zipcode = ? AND s.scheduled_time = ?`,
      [zipCode, currentTime.toISOString()]
    );
  }
}