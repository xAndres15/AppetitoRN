// viewmodels/ReservationConfirmationViewModel.ts
import { useState } from 'react';

interface ReservationConfirmationData {
  date: string;
  time: string;
  numberOfPeople: string;
  name: string;
  email: string;
  phone: string;
  restaurantName: string;
  restaurantLocation: string;
  reservationId?: string;
}

export function useReservationConfirmationViewModel(
  reservationData: ReservationConfirmationData
) {
  const [reservationNumber] = useState(
    reservationData.reservationId 
      ? `R${reservationData.reservationId.slice(-6).toUpperCase()}` 
      : `R${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
  );

  const formatDate = (dateString: string): string => {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} de ${month} ${year}`;
  };

  const getPeopleLabel = (numberOfPeople: string): string => {
    const num = parseInt(numberOfPeople);
    return num === 1 ? '1 Persona' : `${num} Personas`;
  };

  return {
    reservationNumber,
    formatDate,
    getPeopleLabel,
  } as const;
}