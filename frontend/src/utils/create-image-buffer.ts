import isUndefined from "lodash/isUndefined";

export default function createPreviewFromBuffer(preview: number[] | undefined) {
  if (isUndefined(preview)) return;
  const arrayBufferView = new Uint8Array(preview);
  const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
  const urlCreator = window.URL || window.webkitURL;
  return urlCreator.createObjectURL(blob);
}
