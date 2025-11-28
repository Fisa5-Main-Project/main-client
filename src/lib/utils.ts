import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 여러 클래스 이름과 조건부 클래스를 안전하게 결합하고 Tailwind CSS 클래스를 병합합니다.
 * @param {...ClassValue} inputs - 클래스 이름, 클래스 이름 배열, 또는 조건부 클래스 객체.
 * @returns {string} 병합되고 정리된 클래스 이름 문자열.
 *
 * @example
 * // cn('p-4', 'font-bold', isPrimary && 'bg-blue-500');
 * // => 'p-4 font-bold bg-blue-500'
 *
 * @example
 * // cn('p-2', 'p-4');
 * // => 'p-4' (tailwind-merge가 중복을 처리)
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

export const getBankIcon = (bankName: string) => {
    if (!bankName) return '/common/bank_icon/default.png';

    const name = bankName.replace(/\s+/g, ''); // 공백 제거

    const iconMap: { [key: string]: string } = {
        '국민': '국민.svg', 'KB': '국민.svg',
        '신한': '신한.svg',
        '하나': '하나.svg', 'KEB': '하나.svg',
        '우리': '우리.svg',
        '농협': '농협.svg', 'NH': '농협.svg',
        '기업': 'IBK기업.svg', 'IBK': 'IBK기업.svg',
        '카카오': '카카오.svg',
        '토스': '토스.svg',
        '케이': '케이뱅크.svg', 'K': '케이뱅크.svg',
        '삼성': '삼성증권.svg',
        '미래': '미래에셋.svg', '미래에셋': '미래에셋.svg',
        '키움': '키움.svg',
        '한국투자': '한국투자증권.svg', '한투': '한국투자증권.svg',
        '대신': '대신.svg',
        '메리츠': '메리츠증권.svg',
        '부산': 'BNK.svg', 'BNK': 'BNK.svg',
        '광주': 'JB.svg', 'JB': 'JB.svg', '전북': 'JB.svg',
        'SC': 'SC제일.svg', '제일': 'SC제일.svg',
        '대구': '대구.svg', 'DGB': '대구.svg',
        '수협': '수협.svg',
        '신협': '신협.svg',
        '우체국': '우체국.svg',
        '새마을': '새마을.svg',
        '한화': '한화.svg',
        '유진': '유진투자증권.svg',
        '교보': '교보.svg',
        '현대': '현대차증권.svg',
        'DB': 'DB금융투자.svg',
        'SK': 'SK.svg',
        '산업': 'KDB산업.svg', 'KDB': 'KDB산업.svg',
        'SBI': 'SBI저축.svg',
        '저축': '저축은행.svg'
    };

    for (const [key, value] of Object.entries(iconMap)) {
        if (name.includes(key)) return `/common/bank_icon/${value}`;
    }

    return '/common/bank_icon/default.png'; // 기본 아이콘
};
