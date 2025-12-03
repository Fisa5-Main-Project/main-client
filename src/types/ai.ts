export interface RecommendedProduct {
    product_id: string;
    product_type: string;
    product_name: string;
    company_name: string;
    benefit: string;
    reason: string;
}

export interface RecommendationResponse {
    deposit_or_saving?: RecommendedProduct;
    annuity?: RecommendedProduct;
    fund?: RecommendedProduct;
    products?: RecommendedProduct[];
}

export interface ChatProduct {
    id: string;
    icon: string;
    type: string;
    name: string;
    bank: string;
    features: string[];
    stat: string;
    link?: string;
}

export interface FeatureGuide {
    type: 'feature_guide';
    title: string;
    description: string;
    benefit: string;
    link: string;
    button_text: string;
}

export interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    keywords?: string[];
    products?: ChatProduct[];
    featureGuide?: FeatureGuide;
    timestamp?: string;
}

export interface ChatHistoryResponse {
    history: {
        role: string;
        content: string;
        timestamp: string;
    }[];
}

export interface ChatFeedbackRequest {
    user_id: number;
    session_id: string;
    message_id: string;
    feedback: 'like' | 'dislike';
    product_id?: string;
}
