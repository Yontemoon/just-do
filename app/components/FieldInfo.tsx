import { FieldMeta } from "@tanstack/react-form";

function FieldInfo({ fieldMeta }: { fieldMeta: FieldMeta | undefined }) {
  if (!fieldMeta) return null;

  return (
    <>
      {fieldMeta.isTouched && fieldMeta.errors.length ? (
        <p className="text-destructive text-sm mt-1">
          {fieldMeta.errors.join(",")}
        </p>
      ) : null}
      {fieldMeta.isValidating ? "Validating..." : null}
    </>
  );
}

export default FieldInfo;
