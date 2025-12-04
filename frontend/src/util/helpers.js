import { greekLabels } from "util/language";
import { differenceInDays } from "date-fns";

export const isMobile =
  /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(
    navigator.userAgent
  );

export function getWateredColor(wateringStatus) {
  return wateringStatus === greekLabels.TODAY
    ? "blue.500"
    : wateringStatus === greekLabels.YESTERDAY
    ? "blue.300"
    : "orange.600";
}

export function calcNeedsWateringStatus(lastWateredDate) {
  if (!lastWateredDate) return greekLabels.NOT_WATERED;

  const daysPassedWithouWatering = differenceInDays(
    new Date(),
    new Date(lastWateredDate)
  );

  if (daysPassedWithouWatering === 0) {
    return greekLabels.TODAY;
  } else if (daysPassedWithouWatering === 1) {
    return greekLabels.YESTERDAY;
  } else {
    return daysPassedWithouWatering + greekLabels.DAYS_BEFORE;
  }
}

export function calcAllowedWatering(lastWateredDate) {
  if (!lastWateredDate) return true;

  const daysPassedWithouWatering = differenceInDays(
    new Date(),
    new Date(lastWateredDate)
  );

  return daysPassedWithouWatering >= 1;
}

export function toastError(toast, error) {
  toast({
    title: prettifyErrorMessage(error),
    status: "error",
    isClosable: true,
  });
}

export function toastSuccess(toast, message) {
  toast({
    title: message,
    status: "success",
    isClosable: true,
  });
}

export function prettifyErrorMessage(error) {
  if (error.status === 503) {
    return greekLabels.RATE_LIMITED;
  } else {
    return error.message;
  }
}
