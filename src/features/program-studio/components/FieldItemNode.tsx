import { colors, spacers, Tooltip } from "@dhis2/ui";
import React, { BaseSyntheticEvent, useMemo } from "react";

export const FieldItemNode = (props: { field: any }) => {
  const { field } = props;

  const fieldIcon = useMemo(() => {
    if (field.unique) {
      return "./icons/unique-field.svg";
    }

    if (field.optionSetValue) {
      return "./icons/drop-down-field.svg";
    }

    switch (field.valueType) {
      case "TEXT":
      case "LONG_TEXT":
      case "LETTER":
        return "./icons/text-field.svg";
      case "INTEGER":
      case "NUMBER":
      case "INTEGER_POSITIVE":
      case "INTEGER_ZERO_OR_POSITIVE":
        return "./icons/number-field.svg";
      case "INTEGER_NEGATIVE":
        return "./icons/integer-negative-field.svg";
      case "PERCENTAGE":
        return "./icons/percent-field.svg";
      case "UNIT_INTERVAL":
      case "TRACKER_ASSOCIATE":
        return "./icons/number-field.svg";
      case "DATE":
        return "./icons/date-field.svg";
      case "DATETIME":
        return "./icons/date-time-field.svg";
      case "TIME":
        return "./icons/time-field.svg";
      case "BOOLEAN":
        return "/icons/boolean-field.svg";
      case "COORDINATE":
        return "./icons/coordinate-field.svg";
      case "FILE_RESOURCE":
        return "./icons/file-resource-field.svg";
      case "IMAGE":
        return "./icons/image-field.svg";
      case "URL":
        return "./icons/url-field.svg";
      default:
        return "./icons/text-field.svg";
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

      <Tooltip content={`Edit ${field.displayName}`} placement="top">
        <button
          className="p-[1px] border-none bg-transparent flex items-center hover:bg-gray-200 cursor-pointer rounded-sm"
          onClick={(event: BaseSyntheticEvent) => {
            event.stopPropagation();
            console.log(event);
          }}
        >
          <img className="h-[6px]" src="./icons/edit.svg" alt="Edit" />
        </button>
      </Tooltip>
    </div>
  );
};
