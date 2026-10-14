import { useEffect, useState } from 'react';

const CARACTERES_COREANOS = [
    '가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '카', '타', '파', '하',
    '거', '너', '더', '러', '머', '버', '서', '어', '저', '처', '커', '터', '퍼', '허',
    '고', '노', '도', '로', '모', '보', '소', '오', '조', '초', '코', '토', '포', '호',
    '구', '누', '두', '루', '무', '부', '수', '우', '주', '추', '쿠', '투', '푸', '후',
];

function generarMatrix() {
    const columnas = Math.ceil(window.innerWidth / 40) + 2;
    const filas = Math.ceil(window.innerHeight / 40) + 2;
    return Array.from({ length: columnas * filas }, () =>
        CARACTERES_COREANOS[Math.floor(Math.random() * CARACTERES_COREANOS.length)]
    );
}

function MatrixBackground() {
    const [caracteres, setCaracteres] = useState(generarMatrix);

    useEffect(() => {
        let timer;
        const onResize = () => {
            clearTimeout(timer);
            timer = setTimeout(() => setCaracteres(generarMatrix()), 150);
        };
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="jp-matrix" aria-hidden="true">
            {caracteres.map((c, i) => (
                <span key={i}>{c}</span>
            ))}
        </div>
    );
}

export default MatrixBackground;