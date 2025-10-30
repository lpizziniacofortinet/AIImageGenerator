import { GoogleGenAI, Modality } from "@google/genai";
import { Style, AspectRatio } from '../types';

const getMimeType = (dataUrl: string): string => {
    return dataUrl.substring(dataUrl.indexOf(":") + 1, dataUrl.indexOf(";"));
};

const cleanBase64 = (dataUrl: string): string => {
    return dataUrl.substring(dataUrl.indexOf(",") + 1);
};

const generatePrompt = (style: Style, aspectRatio: AspectRatio): string => {
    const aspectPrompt = `The final image must have a ${aspectRatio} aspect ratio.`;
    
    switch (style) {
        case Style.PRO:
            return `Generate a professional headshot suitable for a corporate profile like LinkedIn. The person should be wearing business attire. The background should be a clean, professional office setting or a neutral solid color. The lighting should be flattering. Maintain the person's key facial features from the provided image. ${aspectPrompt}`;
        case Style.CASUAL:
            return `Generate a casual, friendly-looking profile picture. The person should be in a relaxed, natural setting like a cafe, a park, or against an interesting textured wall. They should have a warm, approachable expression. The style should feel authentic and not overly staged. Maintain the person's key facial features from the provided image. ${aspectPrompt}`;
        case Style.BEACH:
            return `Generate a photo of the person relaxing on a beach wearing beach attire. The setting is a beautiful Ligurian beach during a stunning sunset. The mood should be relaxed and serene. Maintain the person's key facial features from the provided image. ${aspectPrompt}`;
        default:
            throw new Error('Invalid style selected.');
    }
};

export const generateProfilePictures = async (
    base64Image: string,
    style: Style,
    aspectRatio: AspectRatio
): Promise<string[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const mimeType = getMimeType(base64Image);
    const cleanedBase64 = cleanBase64(base64Image);

    const generateImage = async (variationPrompt: string) => {
        const fullPrompt = `${generatePrompt(style, aspectRatio)} ${variationPrompt}`;
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        {
                            inlineData: {
                                data: cleanedBase64,
                                mimeType: mimeType,
                            },
                        },
                        {
                            text: fullPrompt,
                        },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });

            if (response.promptFeedback?.blockReason) {
                throw new Error(
                    `Request was blocked due to ${response.promptFeedback.blockReason}. ${response.promptFeedback.blockReasonMessage || ''}`.trim()
                );
            }

            const firstCandidate = response.candidates?.[0];

            if (!firstCandidate) {
                throw new Error('No content generated. The response may have been blocked or empty.');
            }

            for (const part of firstCandidate.content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                }
            }
            throw new Error('No image data found in response, but the request was not explicitly blocked.');
        } catch (error) {
            console.error('Error generating one of the images:', error);
            // Re-throw to be caught by Promise.all
            throw error;
        }
    };
    
    const variationPrompts = [
        "First variation.",
        "Second variation with slightly different lighting.",
        "Third variation with a different background.",
        "Fourth variation with a different pose or expression."
    ];

    try {
        const imagePromises = variationPrompts.map(prompt => generateImage(prompt));
        const results = await Promise.all(imagePromises);
        return results;
    } catch (error) {
        console.error('Failed to generate images:', error);
        throw new Error('Could not generate all images. The model may have refused the request due to safety policies. Please try a different photo or prompt.');
    }
};