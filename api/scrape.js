export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Brak URL" });

  try {
    // Pobranie HTML strony
    const response = await fetch(url);
    const html = await response.text();

    // Dodanie Twojego linku afiliacyjnego
    const finalLink = url.includes("affcode=")
      ? url
      : url + (url.includes("?") ? "&" : "?") + "affcode=dexxter";

    // Zwracamy HTML i finalLink w JSON
    res.status(200).json({ html, finalLink });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
