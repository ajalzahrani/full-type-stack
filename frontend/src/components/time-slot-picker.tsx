import React from "react";
import { Button } from "@/components/ui/button";

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface TimeSlotPickerProps {
  availableSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

export function TimeSlotPicker({
  availableSlots,
  selectedSlot,
  onSelectSlot,
}: TimeSlotPickerProps) {
  console.log(availableSlots);
  return (
    <div className="grid grid-cols-3 gap-2">
      {availableSlots.map((slot) => (
        <Button
          key={`${slot.startTime}-${slot.endTime}`}
          variant={selectedSlot === slot ? "default" : "outline"}
          onClick={() => onSelectSlot(slot)}>
          {slot.startTime} - {slot.endTime}
        </Button>
      ))}
    </div>
  );
}
