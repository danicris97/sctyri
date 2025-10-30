const pad = (value: string | number, length = 4) =>
  String(value ?? "")
    .replace(/\D/g, "")
    .padStart(length, "0");

const yy = (year: number) => String(year).slice(-2);

const filenameByType = (type: string, year: number, number: string) => {
  const num3 = pad(number, 3);
  const num4 = pad(number, 4);
  const map: Record<string, string | ((y: number, num: string) => string)> = {
    CS: (y) => `R-CS-${y}-${num3}.pdf`,
    DR: (y) =>
      `R-DR-${y}-${num4}.${y >= 1999 && y <= 2009 ? "html" : "pdf"}`,
    CDEX: (y) => `RCD-${num3}-${y}-EXA-UNSa.pdf`,
    DEX: (y) => `RD-${num3}-${y}-EXA-UNSa.pdf`,
    CDNAT: (y) => `R-CDNAT-${y}-${num4}.pdf`,
    DNAT: (y) => `R-DNAT-${y}-${num4}.pdf`,
    CDECO: (y) => `R-CDECO-${y}-${num4}.pdf`,
    DECO: (y) => `R-DECO-${y}-${num4}.pdf`,
    CDSALUD: (y) => `CDSALUD-${y}-${num3}.pdf`,
    CDH: (y) => `Res._${num4}_${yy(y)}.pdf`,
    DH: (y) => `Res._${num4}_${yy(y)}.pdf`,
    CDING: (y) => `R-CDI-${y}-${num4}.pdf`,
    DING: (y) => `R-DING-${y}-${num4}.pdf`,
    CDFRO: (y) => `Res.CA-SO-${num3}-${y}.pdf`,
    DFRO: (y) => `Res.${num3}-${y}.pdf`,
    SRO: (y) => `Res.${num3}-${y}.pdf`,
    CDFRMT: (y) => `R-CDFRMT-SES-UNSA-${y}-${num4}.pdf`,
    DFRMT: (y) => `R-FRMT-SES-UNSA-${y}-${num4}.pdf`,
    SRTCA: (y) => `R-CASRT-SES-UNSA-${y}-${num4}.pdf`,
    SRT: (y) => `R-SRT-SES-UNSA-${y}-${num4}.pdf`,
    IEMT: (y) => `R-IEMTAR-${y}-${num4}.pdf`,
    SRMRF: (y) => `R-SRS-${y}-${num3}.pdf`,
    CCI: (y) => `R-CCI-${y}-${num4}.pdf`,
    CI: (y) => `R-CI-${y}-${num4}.pdf`,
  };

  const key = (type ?? "").toUpperCase();
  const fallback = (y: number) => `R-${key}-${y}-${num4}.pdf`;
  const builder = map[key];
  return typeof builder === "function" ? builder(year, number) : builder ?? fallback(year);
};

export const getLinkFromData = (
  type: string | null | undefined,
  date: string | Date | null | undefined,
  number: string | null | undefined
) => {
  if (!type || !date || !number) return "";
  const year = new Date(date).getFullYear();
  const base = "https://bo.unsa.edu.ar";
  const folder = String(type).toLowerCase();
  const file = filenameByType(type, year, number);
  return `${base}/${folder}/R${year}/${file}`;
};

export const normalizeResolutionDate = (
  value: string | Date | null | undefined
) => {
  if (!value) return "";
  if (typeof value === "string") {
    return value.includes("T") ? value.slice(0, 10) : value;
  }
  return value.toISOString().slice(0, 10);
};
