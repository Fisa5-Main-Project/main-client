import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerRecipients, Recipient } from "@/api/video";
import { useAlertStore } from "@/stores/common/useAlertStore";

export const useVideoRecipients = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const videoId = searchParams.get("videoId");
    const { openAlert } = useAlertStore();

    const [recipients, setRecipients] = useState<Recipient[]>([
        { email: "", scheduledSendDate: "" },
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [minDate, setMinDate] = useState("");

    useEffect(() => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localIso = new Date(now.getTime() - offset).toISOString().slice(0, 16);
        setMinDate(localIso);
    }, []);

    const handleAddRecipient = () => {
        setRecipients([...recipients, { email: "", scheduledSendDate: "" }]);
    };

    const handleRemoveRecipient = (index: number) => {
        const newRecipients = recipients.filter((_, i) => i !== index);
        setRecipients(newRecipients);
    };

    const handleChange = (
        index: number,
        field: keyof Recipient,
        value: string
    ) => {
        const newRecipients = [...recipients];
        newRecipients[index] = { ...newRecipients[index], [field]: value };
        setRecipients(newRecipients);
    };

    const handleSubmit = async () => {
        if (!videoId) {
            setError("잘못된 접근입니다. 비디오 ID가 없습니다.");
            return;
        }

        const now = new Date();
        for (const r of recipients) {
            if (!r.email || !r.scheduledSendDate) {
                setError("모든 수신자의 이메일과 발송일을 입력해주세요.");
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) {
                setError("올바른 이메일 형식이 아닙니다.");
                return;
            }
            const selectedDate = new Date(r.scheduledSendDate);
            if (selectedDate <= now) {
                setError("발송 예약일은 현재 시간 이후여야 합니다.");
                return;
            }
        }

        try {
            setLoading(true);
            setError(null);

            const formattedRecipients = recipients.map((r) => ({
                ...r,
                scheduledSendDate: new Date(r.scheduledSendDate).toISOString(),
            }));

            await registerRecipients(Number(videoId), formattedRecipients);

            openAlert("영상 편지가 성공적으로 예약되었습니다.", "알림", () => {
                router.push("/inheritance/recommend");
            });
        } catch (err) {
            console.error("Failed to register recipients:", err);
            const errorMessage = err instanceof Error ? err.message : "수신자 등록 중 오류가 발생했습니다.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        recipients,
        loading,
        error,
        minDate,
        handleAddRecipient,
        handleRemoveRecipient,
        handleChange,
        handleSubmit,
    };
};
