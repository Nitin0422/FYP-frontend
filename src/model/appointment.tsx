export type Appointment = {
    id: number;
    slot_id: number;
    patient: number;
    patient_full_name: string;
    notes: string;
    doctor_id: number;
    doctor_full_name: string;
    date: string;
    time: string;
    slots_available: number;
    previous_appointment: number;
    rating: number;
  };
  