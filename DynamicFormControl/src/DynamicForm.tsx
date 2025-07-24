import * as React from "react";
import { TextField, MaskedTextField } from "@fluentui/react/lib/TextField";
import { DatePicker } from "@fluentui/react/lib/DatePicker";
import { fields } from "./fieldConfig";


interface DynamicFormProps {
  value: Record<string, string>;
  onChange: (newValue: Record<string, string>) => void;
}


const DynamicForm: React.FC<DynamicFormProps> = ({ value, onChange }) => {
  const handleFieldChange = (fieldName: string, newVal: string | undefined) => {
    onChange({
      ...value,
      [fieldName]: newVal || ""
    });
  };

  return (
    <div style={{ padding: 10 }}>
      {fields.map((field) => {
        switch (field.type) {
          case "string":
          case "email":
            return (
              <TextField
                key={field.name}
                label={field.displayname}
                name={field.name}
                value={value[field.name] || ""}
                onChange={(e, newVal) => handleFieldChange(field.name, newVal)}
              />
            );
          case "phone":
            return (
              <MaskedTextField
                key={field.name}
                label={field.displayname}
                mask="(999) 999-9999"
                name={field.name}
                value={value[field.name] || ""}
                onChange={(e, newVal) => handleFieldChange(field.name, newVal)}
              />
            );
          case "date":
            return (
              <DatePicker
                key={field.name}
                label={field.displayname}
                placeholder="Select a date..."
                // You'll need to parse and serialize date values here
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};


export default DynamicForm;
