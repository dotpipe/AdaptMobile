# src/services/recommendation_engine.py

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from src.services.api import API
from src.utils.data_processing import preprocess_text

class RecommendationEngine:
    def __init__(self):
        self.api = API()
        self.vectorizer = TfidfVectorizer()
        self.deal_vectors = None
        self.deals = None

    async def update_deals(self):
        self.deals = await self.api.get_all_deals()
        deal_descriptions = [preprocess_text(deal['description']) for deal in self.deals]
        self.deal_vectors = self.vectorizer.fit_transform(deal_descriptions)

    async def get_user_preferences(self, user_id):
        user_data = await self.api.get_user_data(user_id)
        return user_data['preferences']

    async def get_personalized_recommendations(self, user_id, num_recommendations=5):
        if self.deals is None:
            await self.update_deals()

        user_preferences = await self.get_user_preferences(user_id)
        user_vector = self.vectorizer.transform([preprocess_text(' '.join(user_preferences))])

        similarities = cosine_similarity(user_vector, self.deal_vectors).flatten()
        top_indices = similarities.argsort()[-num_recommendations:][::-1]

        recommended_deals = [self.deals[i] for i in top_indices]
        return recommended_deals

    async def update_user_preferences(self, user_id, new_preference):
        current_preferences = await self.get_user_preferences(user_id)
        updated_preferences = current_preferences + [new_preference]
        await self.api.update_user_preferences(user_id, updated_preferences)

# Usage in the main app
async def get_recommendations_for_user(user_id):
    engine = RecommendationEngine()
    recommendations = await engine.get_personalized_recommendations(user_id)
    return recommendations