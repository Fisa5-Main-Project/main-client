import { apiClient as client } from "./index";
import type { ApiResponse } from "@/types/api";

// --- Types ---
export interface VideoUploadInitResponse {
    inheritanceId: number;
    videoId: number;
    uploadId: string;
    s3ObjectKey: string;
}

export interface VideoPartUrlResponse {
    partNumber: number;
    partUploadUrl: string;
}

export interface VideoUploadCompleteRequest {
    uploadId: string;
    partETags: {
        partNumber: number;
        eTag: string;
    }[];
}

export interface Recipient {
    email: string;
    scheduledSendDate: string; // ISO 8601 format
}

export interface RecipientListRequest {
    recipients: Recipient[];
}

// --- API Functions ---

/**
 * [1] Multipart Upload 시작 (Init)
 */
export const initiateVideoUpload = async (inheritanceId: number) => {
    const response = await client.post<ApiResponse<VideoUploadInitResponse>>(
        `/inheritance/${inheritanceId}/video/upload/init`
    );
    return response.data;
};

/**
 * [2] Multipart Upload 조각(Part) URL 요청
 */
export const getPartUploadUrl = async (
    inheritanceId: number,
    uploadId: string,
    partNumber: number
) => {
    const response = await client.get<ApiResponse<VideoPartUrlResponse>>(
        `/inheritance/${inheritanceId}/video/upload/part`,
        {
            params: { uploadId, partNumber },
        }
    );
    return response.data;
};

/**
 * [3] Multipart Upload 완료 (Complete)
 */
export const completeVideoUpload = async (
    inheritanceId: number,
    data: VideoUploadCompleteRequest
) => {
    const response = await client.post<ApiResponse<void>>(
        `/inheritance/${inheritanceId}/video/upload/complete`,
        data
    );
    return response.data;
};

/**
 * 영상편지 삭제
 */
export const deleteVideo = async (inheritanceId: number) => {
    const response = await client.delete<ApiResponse<void>>(
        `/inheritance/${inheritanceId}/video`
    );
    return response.data;
};

/**
 * 수신자 및 예약 등록
 */
export const registerRecipients = async (
    videoId: number,
    recipients: Recipient[]
) => {
    const response = await client.post<ApiResponse<void>>(
        `/inheritance/video/${videoId}/recipients`,
        { recipients }
    );
    return response.data;
};
