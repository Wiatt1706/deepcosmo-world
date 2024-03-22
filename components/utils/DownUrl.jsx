"use client";

const link = document.createElement("a");
link.style.display = "none";
document.body.appendChild(link);

function save(blob, filename) {
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export function saveString(text, filename) {
  save(new Blob([text], { type: "application/octet-stream" }), filename);
}
