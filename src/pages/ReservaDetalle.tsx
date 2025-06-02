import { useParams } from 'react-router-dom';
import { getReservaById } from '../services/reserva/ReservaApi';
import ReservaView from '../components/display/ReservaView';
import { useEffect, useState } from 'react';
import Reserva from '../types/Reserva';
import HuespedCardList from '../components/display/cards/HuespedCardList';
import Huesped from '../types/Huesped';
import { getHuespedesByReservaId } from '../services/huesped/HuespedApi';
import HuespedResumen, { getHuespedResumen } from '../types/HuespedResumen';

export default function ReservaDetalle() {
    const { id } = useParams();
    const [reserva, setReserva] = useState<Reserva | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [huespedes, setHuespedes] = useState<Huesped[]>([]);

    useEffect(() => {
        if (!id) return;

        getReservaById(id)
            .then((res) => setReserva(res))
            .catch((err: Error) => setError(err.message));

        getHuespedesByReservaId(id)
            .then((res) => setHuespedes(res))
            .catch((err: Error) => console.log(err));
    }, [id]);

    if (error) return <div>Error: {error}</div>;
    if (!reserva) return <div>Cargando...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-row space-x-4">
                <div className="w-2/3">
                    <ReservaView reserva={reserva} />
                </div>
                <div className="w-full lg:w-2/5">
                    <div className="sticky top-4">
                        <h3 className="mb-2 text-center text-lg font-semibold text-gray-700">
                            Huéspedes asociados
                        </h3>
                        <HuespedCardList
                            huespedesResumen={huespedes
                                .map((h) => getHuespedResumen(h))
                                .filter((r): r is HuespedResumen => r !== null)}
                            navModeOn={true}
                            // mensaje que se imprime si la array esta vacia
                            message="esta reserva no tiene huespedes"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
