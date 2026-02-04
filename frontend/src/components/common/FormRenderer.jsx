import Input from "../ui/Input";
import Select from "../ui/Select";

export default function FormRenderer({
  fields,
  values,
  errors = {},
  onChange,
}) {
  return (
    <div className="space-y-4">
      {fields.map(field => {
        if (field.type === "select") {
          return (
            <Select
              key={field.name}
              name={field.name}
              label={field.label}
              options={field.options}
              value={values[field.name] || ""}
              error={errors[field.name]}
              onChange={e =>
                onChange(field.name, e.target.value)
              }
            />
          );
        }

        return (
          <Input
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            value={values[field.name] || ""}
            error={errors[field.name]}
            onChange={e =>
              onChange(field.name, e.target.value)
            }
          />
        );
      })}
    </div>
  );
}
