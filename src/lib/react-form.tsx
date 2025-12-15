import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, type NativeSelectProps } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "./utils"

export const { fieldContext, formContext, useFieldContext } = createFormHookContexts()

function TextField({
  label,
  placeholder,
  description,
  fieldProps,
  ...rest
}: {
  label: string
  placeholder: string
  description?: string
  fieldProps?: React.ComponentProps<typeof Field>
} & React.ComponentProps<"input">) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <Field {...fieldProps} className={cn("gap-1", fieldProps?.className)}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      <FieldContent>
        <Input
          id={field.name}
          placeholder={placeholder}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? `${field.name}-error` : undefined}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          {...rest}
        />
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>
    </Field>
  )
}

function TextareaField({
  label,
  placeholder,
  description,
  fieldProps,
  ...rest
}: {
  label: string
  placeholder: string
  description?: string
  fieldProps?: React.ComponentProps<typeof Field>
} & React.ComponentProps<"textarea">) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <Field {...fieldProps} className={cn("gap-1", fieldProps?.className)}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        placeholder={placeholder}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? `${field.name}-error` : undefined}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        {...rest}
      />
      <FieldContent>
        {description && <FieldDescription>{description}</FieldDescription>}
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>
    </Field>
  )
}

function SelectField({
  label,
  description,
  children,
  fieldProps,
  ...rest
}: {
  label: string
  description?: string
  children: React.ReactNode
  fieldProps?: React.ComponentProps<typeof Field>
} & NativeSelectProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <Field {...fieldProps} className={cn("gap-1", fieldProps?.className)}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      <FieldContent>
        <NativeSelect
          id={field.name}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? `${field.name}-error` : undefined}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          className="w-full"
          {...rest}
        >
          {children}
        </NativeSelect>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>
    </Field>
  )
}

function CheckboxField({
  label,
  description,
  fieldProps,
  ...rest
}: { label: string; description?: string; fieldProps?: React.ComponentProps<typeof Field> } & Omit<
  React.ComponentProps<typeof Checkbox>,
  "checked" | "onCheckedChange"
>) {
  const field = useFieldContext<boolean>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <Field orientation="horizontal" {...fieldProps}>
      <Checkbox
        id={field.name}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? `${field.name}-error` : undefined}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
        {...rest}
      />
      <FieldContent>
        <FieldLabel htmlFor={field.name} className="cursor-pointer">
          {label}
        </FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>
    </Field>
  )
}

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    CheckboxField,
  },
  formComponents: {},
})

export { useAppForm }
