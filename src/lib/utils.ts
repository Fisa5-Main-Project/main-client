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
        국민: '국민.svg',
        KB: '국민.svg',
        신한: '신한.svg',
        제주: '신한.svg',
        하나: '하나.svg',
        KEB: '하나.svg',
        우리: '우리.svg',
        농협: '농협.svg',
        NH: '농협.svg',
        엔에이치: '농협.svg',
        기업: 'IBK기업.svg',
        IBK: 'IBK기업.svg',
        카카오: '카카오.svg',
        토스: '토스.svg',
        케이: '케이뱅크.svg',
        K: '케이뱅크.svg',
        삼성: '삼성증권.svg',
        미래: '미래에셋.svg',
        미래에셋: '미래에셋.svg',
        키움: '키움.svg',
        한국투자: '한국투자증권.svg',
        한투: '한국투자증권.svg',
        대신: '대신.svg',
        메리츠: '메리츠증권.svg',
        부산: 'BNK.svg',
        BNK: 'BNK.svg',
        경남: 'BNK.svg',
        광주: 'JB.svg',
        JB: 'JB.svg',
        전북: 'JB.svg',
        SC: 'SC제일.svg',
        제일: 'SC제일.svg',
        대구: '대구.svg',
        DGB: '대구.svg',
        수협: '수협.svg',
        신협: '신협.svg',
        우체국: '우체국.svg',
        새마을: '새마을.svg',
        한화: '한화.svg',
        유진: '유진투자증권.svg',
        교보: '교보.svg',
        현대: '현대차증권.svg',
        DB: 'DB금융투자.svg',
        SK: 'SK.svg',
        산업: 'KDB산업.svg',
        KDB: 'KDB산업.svg',
        SBI: 'SBI저축.svg',
        저축: '저축은행.svg',
        신영: '신영.jpg',
        트러스톤: '트러스톤.jpg',
        아이엠: '아이엠.jpg',
        iM: '아이엠.jpg',
    };

    for (const [key, value] of Object.entries(iconMap)) {
        if (name.includes(key)) return `/common/bank_icon/${value}`;
    }

    return '/common/bank_icon/default.png'; // 기본 아이콘
};

export const getBankLink = (companyName: string, productName: string) => {
    const name = companyName.replace(/\s+/g, '');

    const urlMap: { [key: string]: string } = {
        국민: 'https://www.kbstar.com/',
        KB: 'https://www.kbstar.com/',
        신한: 'https://www.shinhan.com/',
        하나: 'https://www.kebhana.com/',
        우리: 'https://www.wooribank.com/',
        농협: 'https://banking.nonghyup.com/',
        NH: 'https://banking.nonghyup.com/',
        기업: 'https://www.ibk.co.kr/',
        IBK: 'https://www.ibk.co.kr/',
        카카오: 'https://www.kakaobank.com/',
        토스: 'https://www.tossbank.com/',
        케이: 'https://www.kbanknow.com/',
        삼성: 'https://www.samsungpop.com/',
        미래: 'https://securities.miraeasset.com/',
        한국투자: 'https://securities.koreainvestment.com/',
        키움: 'https://www.kiwoom.com/',
        대신: 'https://www.daishin.com/',
        메리츠: 'https://home.meritz.co.kr/',
        부산: 'https://www.busanbank.co.kr/',
        광주: 'https://www.kjbank.com/',
        전북: 'https://www.jbbank.co.kr/',
        SC: 'https://www.standardchartered.co.kr/',
        대구: 'https://www.dgb.co.kr/',
        경남: 'https://www.knbank.co.kr/',
        수협: 'https://suhyup-bank.com/',
        신협: 'https://www.cu.co.kr/',
        우체국: 'https://www.epostbank.go.kr/',
        새마을: 'https://www.kfcc.co.kr/',
        한화: 'https://www.hanwhawm.com/',
        유안타: 'https://www.myasset.com/',
        유진: 'https://www.eugenefn.com/',
        교보: 'https://www.iprovest.com/',
        하이: 'https://www.hi-ib.com/',
        현대: 'https://www.hmsec.com/',
        DB: 'https://www.db-fi.com/',
        SK: 'https://www.sks.co.kr/',
        LS: 'https://www.ls-sec.co.kr/',
        트러스톤: 'https://www.trustonasset.com/?taxonomy=ta_fund_cat&term=all',
        아이엠: 'http://www.im-fund.com/ca10.do?g_FUND_TYPE=FUND',
        iM: 'http://www.im-fund.com/ca10.do?g_FUND_TYPE=FUND',
    };

    let baseUrl = `https://search.naver.com/search.naver?query=${companyName} ${productName}`;

    for (const [key, url] of Object.entries(urlMap)) {
        if (name.includes(key)) {
            baseUrl = url;
            break;
        }
    }

    return baseUrl;
};
