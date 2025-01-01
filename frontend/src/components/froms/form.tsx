/* eslint-disable no-unused-vars */
import { E164Number } from "libphonenumber-js/core";
import { Control } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import ReactDatePicker from "react-datepicker";

import { Checkbox } from "../ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import { MultiSelect } from "@/components/ui/multi-select";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  TIME_PICKER = "timePicker",
  DATE_PICKER = "datePicker",
  DATE_PICKER_CUSTOM = "datePickerCustom",
  SELECT = "select",
  MULTI_SELECT = "multiSelect",
  SKELETON = "skeleton",
  NUMBER = "number",
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  step?: number;
  onChange?: (date: Date) => void;
  onMultiSelectChange?: (selected: string[]) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  options?: any;
  selected?: any;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {/* {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )} */}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0"
              onKeyDown={props.onKeyDown}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            // defaultCountry="US"
            // placeholder={props.placeholder}
            // international
            // withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="mt-2 h-11 rounded-md px-3 text-sm border"
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    case FormFieldType.TIME_PICKER:
      return (
        <FormControl>
          <Input
            value={field.value}
            placeholder={props.placeholder}
            type="time"
            onChange={field.onChange}
            className="time-picker"
          />
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <FormControl>
          <Input
            value={field.value}
            placeholder={props.placeholder}
            type="date"
            onChange={field.onChange}
            className="time-picker"
          />
        </FormControl>
      );
    case FormFieldType.DATE_PICKER_CUSTOM:
      return (
        <div className="flex rounded-md border border-input bg-transparent">
          <FormControl>
            <ReactDatePicker
              selected={field.value ? new Date(field.value) : null}
              onChange={(date: Date | null) => {
                field.onChange(date?.toISOString());
                // Clear any selected time slot when date changes
                // form.setValue("startTime", "");
                // form.setValue("endTime", "");
              }}
              dateFormat="MMMM d, yyyy"
              placeholderText={props.placeholder}
              className="flex w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              calendarClassName="time-slot-calendar"
              inline={false}
              renderCustomHeader={({
                date,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div className="flex items-center justify-between px-2 py-2">
                  <button
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    type="button"
                    className="p-1 hover:bg-accent rounded-sm">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="text-sm font-medium">
                    {format(date, "MMMM yyyy")}
                  </div>
                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    type="button"
                    className="p-1 hover:bg-accent rounded-sm">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.NUMBER:
      return (
        <FormControl>
          <Input
            value={field.value}
            placeholder={props.placeholder}
            type="number"
            onChange={field.onChange}
            className="time-picker"
            step={props.step}
          />
        </FormControl>
      );
    case FormFieldType.SELECT:
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger>
            <SelectValue
              placeholder={props.placeholder}
              defaultValue={props.defaultValue}
            />
          </SelectTrigger>
          <SelectContent>{props.children}</SelectContent>
        </Select>
      );
    case FormFieldType.MULTI_SELECT:
      return (
        <>
          {props.onMultiSelectChange && (
            <MultiSelect
              options={props.options}
              selected={props.selected}
              onChange={props.onMultiSelectChange}
              placeholder={props.placeholder}
            />
          )}
        </>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;

    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="shad-input-label">{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />

          {props.description && (
            <p className="text-xs text-gray-500">{props.description}</p>
          )}

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
