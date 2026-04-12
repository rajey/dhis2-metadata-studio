import { colors, spacers, Tooltip } from "@dhis2/ui";
import React, { BaseSyntheticEvent, useMemo } from "react";
import { iconUrl } from "../../../utils/asset";

export const FieldItemNode = (props: {
  field: any;
  onEdit?: (field: any) => void;
}) => {
  const { field, onEdit } = props;

  const fieldIcon = useMemo(() => {
    if (field.unique) {
      return iconUrl("unique-field.svg");
    }

    if (field.optionSetValue) {
      return iconUrl("drop-down-field.svg");
    }

    switch (field.valueType) {
      case "TEXT":
      case "LONG_TEXT":
      case "LETTER":
        return iconUrl("text-field.svg");
      case "INTEGER":
      case "NUMBER":
      case "INTEGER_POSITIVE":
      case "INTEGER_ZERO_OR_POSITIVE":
        return iconUrl("number-field.svg");
      case "INTEGER_NEGATIVE":
        return iconUrl("integer-negative-field.svg");
      case "PERCENTAGE":
        return iconUrl("percent-field.svg");
      case "UNIT_INTERVAL":
      case "TRACKER_ASSOCIATE":
        return iconUrl("number-field.svg");
      case "DATE":
        return iconUrl("date-field.svg");
      case "DATETIME":
        return iconUrl("date-time-field.svg");
      case "TIME":
        return iconUrl("time-field.svg");
      case "BOOLEAN":
        return iconUrl("boolean-field.svg");
      case "COORDINATE":
        return iconUrl("coordinate-field.svg");
      case "FILE_RESOURCE":
        return iconUrl("file-resource-field.svg");
      case "IMAGE":
        return iconUrl("image-field.svg");
      case "URL":
        return iconUrl("url-field.svg");
      default:
        return iconUrl("text-field.svg");
    }
  }, [field]);

  return (
    <div
      style={{
        borderTopStyle: "solid",
        borderTopColor: colors.green100,
        borderTopWidth: 0.6,
        padding: spacers.dp4,
        fontSize: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacers.dp4,
        color: colors.grey900,
      }}
    >
      <div className="flex items-center gap-1">
        <img
          alt="icon"
          src={fieldIcon}
          style={{
            height: 6,
          }}
        />
        <div>{field.displayName}</div>
      </div>

      {onEdit && (
        <Tooltip content={`Edit ${field.displayName}`} placement="top">
          <button
            className="p-[1px] border-none bg-transparent flex items-center hover:bg-gray-200 cursor-pointer rounded-sm"
            onClick={(event: BaseSyntheticEvent) => {
              event.stopPropagation();
              onEdit(field);
            }}
          >
            <img className="h-[6px]" src={iconUrl("edit.svg")} alt="Edit" />
          </button>
        </Tooltip>
      )}
    </div>
  );
};
