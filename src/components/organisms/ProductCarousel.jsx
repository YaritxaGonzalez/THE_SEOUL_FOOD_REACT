import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';

const INTERVAL = 2500;

function ProductCarousel({ limit = 6 }) {
    const { products } = useProducts();
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);

    const slides = products.filter((p) => p.stock > 0).slice(0, limit);
    const total = slides.length;
    const current = total ? index % total : 0; // evita índices inválidos si el admin borra productos

    const goTo = (i) => setIndex((i + total) % total);

    // Reemplaza setInterval + resetAuto(): cada vez que cambia el slide
    // (automático o manual) el timer se limpia y se vuelve a crear.
    useEffect(() => {
        if (total < 2) return;
        const t = setTimeout(() => setIndex((current + 1) % total), INTERVAL);
        return () => clearTimeout(t);
    }, [current, total]);

    if (total === 0) return null;

    return (
        <div id="carrusel">
            <div className="carrusel-container">
                <button type="button" className="carrusel-arrow" onClick={() => goTo(current - 1)} aria-label="Anterior">
                    ‹
                </button>

                <div className="carrusel-track">
                    {slides.map((p, i) => (
                        <div
                            key={p.id}
                            className={`carrusel-slide ${i === current ? 'a' : ''}`}
                            style={{ backgroundImage: `url(${p.image})` }}
                            role="link"
                            aria-label={p.name}
                            onClick={() => navigate(`/products/${p.id}`)}
                        />
                    ))}
                </div>

                <button type="button" className="carrusel-arrow" onClick={() => goTo(current + 1)} aria-label="Siguiente">
                    ›
                </button>
            </div>

            <ul className="slide">
                {slides.map((p, i) => (
                    <li
                        key={p.id}
                        className={i === current ? 'b' : ''}
                        onClick={() => goTo(i)}
                        aria-label={`Ir a ${p.name}`}
                    />
                ))}
            </ul>
        </div>
    );
}

export default ProductCarousel;