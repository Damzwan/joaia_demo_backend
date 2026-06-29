export interface Place {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    category?: string;
    rating?: number;
    address?: string;
    note?: string;
    thumbnail?: string;
    isExactMatch?: boolean;
}

export interface TourStop {
    order: number;
    place: Place;
    note?: string;
}

export interface Tour {
    id: string;
    title: string;
    stops: TourStop[];
    durationMinutes?: number;
    summary?: string;
}

export interface Review {
    author: string;
    rating: number;
    text: string;
    when: string;
}

export interface PlaceDetails extends Place {
    photos?: string[];
    website?: string;
    phone?: string;
    openNow?: boolean;
    hours?: string[];
    priceLevel?: number;
    userRatingCount?: number;
    description?: string;
    reviews?: Review[];
}