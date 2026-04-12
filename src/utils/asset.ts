const trimTrailingSlash = (value: string): string => {
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

export const getPublicUrl = (): string => {
  if (typeof document !== "undefined") {
    const baseEl = document.querySelector("base[href]");
    const baseHref = baseEl?.getAttribute("href");
    if (baseHref) {
      return trimTrailingSlash(baseHref);
    }
  }

  if (typeof window !== "undefined") {
    const win = window as unknown as {
      __DHIS2_APP_ROOT__?: string;
      __dhis2_app_root__?: string;
      dhis2?: { app?: { root?: string } };
    };
    const dhis2Root =
      win.__DHIS2_APP_ROOT__ ||
      win.__dhis2_app_root__ ||
      win.dhis2?.app?.root;
    if (dhis2Root) {
      return trimTrailingSlash(dhis2Root);
    }
  }

  const raw = process.env.PUBLIC_URL || "";
  return trimTrailingSlash(raw);
};

import addIcon from "../assets/icons/add.svg";
import booleanFieldIcon from "../assets/icons/boolean-field.svg";
import calendarFieldIcon from "../assets/icons/calendar-field.svg";
import coordinateFieldIcon from "../assets/icons/coordinate-field.svg";
import dateFieldIcon from "../assets/icons/date-field.svg";
import dateTimeFieldIcon from "../assets/icons/date-time-field.svg";
import dropDownFieldIcon from "../assets/icons/drop-down-field.svg";
import editIcon from "../assets/icons/edit.svg";
import fileResourceFieldIcon from "../assets/icons/file-resource-field.svg";
import imageFieldIcon from "../assets/icons/image-field.svg";
import integerNegativeFieldIcon from "../assets/icons/integer-negative-field.svg";
import mailFieldIcon from "../assets/icons/mail-field.svg";
import numberFieldIcon from "../assets/icons/number-field.svg";
import percentFieldIcon from "../assets/icons/percent-field.svg";
import repeatableIcon from "../assets/icons/repeatable.svg";
import textFieldIcon from "../assets/icons/text-field.svg";
import timeFieldIcon from "../assets/icons/time-field.svg";
import uniqueFieldIcon from "../assets/icons/unique-field.svg";
import urlFieldIcon from "../assets/icons/url-field.svg";

const iconMap: Record<string, string> = {
  "add.svg": addIcon,
  "boolean-field.svg": booleanFieldIcon,
  "calendar-field.svg": calendarFieldIcon,
  "coordinate-field.svg": coordinateFieldIcon,
  "date-field.svg": dateFieldIcon,
  "date-time-field.svg": dateTimeFieldIcon,
  "drop-down-field.svg": dropDownFieldIcon,
  "edit.svg": editIcon,
  "file-resource-field.svg": fileResourceFieldIcon,
  "image-field.svg": imageFieldIcon,
  "integer-negative-field.svg": integerNegativeFieldIcon,
  "mail-field.svg": mailFieldIcon,
  "number-field.svg": numberFieldIcon,
  "percent-field.svg": percentFieldIcon,
  "repeatable.svg": repeatableIcon,
  "text-field.svg": textFieldIcon,
  "time-field.svg": timeFieldIcon,
  "unique-field.svg": uniqueFieldIcon,
  "url-field.svg": urlFieldIcon,
};

export const iconUrl = (filename: string): string => {
  return iconMap[filename] || textFieldIcon;
};
