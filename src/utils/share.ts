export type ShareResult = "shared" | "whatsapp" | "copied";

export async function shareList(text: string): Promise<ShareResult> {
  if (navigator.share) {
    await navigator.share({ text, title: "Lista de la compra" });
    return "shared";
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  const popup = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  if (popup) {
    return "whatsapp";
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return "copied";
  }

  throw new Error("No se pudo compartir la lista");
}
