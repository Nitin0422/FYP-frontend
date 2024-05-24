type Article = {
    description: string;
    linkRelationship: string;
    "@type": string;
    articleStatus: string;
    mainEntityOfPage: {
        "@type": string;
        genre: string[];
        datePublished: string;
        dateModified: string;
        lastReviewed: string[];
        reviewDue: string;
        keywords: string;
        code: {
            "@type": string;
            codeValue: string;
            codingSystem: string;
        }[];
    };
    url: string;
    name: string;
};
