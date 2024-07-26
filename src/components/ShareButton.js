// src/components/ShareButton.js
import React from 'react';
import { Share, Button } from 'react-native';

const ShareButton = ({ deal }) => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this amazing deal: ${deal.title} at ${deal.storeName}! Get it now on our app!`,
        url: 'https://our-app-store-link.com',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return <Button onPress={onShare} title="Share Deal" />;
};

export default ShareButton;