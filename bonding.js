/**
 * CSA Rule 10-616 / Table 16 bonding conductor sizing helpers.
 *
 * Scope note: this helper is intended for field-installed system bonding jumpers
 * and bonding conductors at other-than-service equipment where OCP-based sizing applies.
 * Service bonding conductor sizing requirements are excluded.
 */

const CSA_TABLE_16_BONDING_SIZES = [
  { ocpNotExceeding: 20, wireCopper: "14 AWG", wireAluminum: "12 AWG", busCopperMm2: 2.0, busAluminumMm2: 3.5 },
  { ocpNotExceeding: 30, wireCopper: "12 AWG", wireAluminum: "10 AWG", busCopperMm2: 3.5, busAluminumMm2: 5.5 },
  { ocpNotExceeding: 60, wireCopper: "10 AWG", wireAluminum: "8 AWG", busCopperMm2: 5.5, busAluminumMm2: 8.5 },
  { ocpNotExceeding: 100, wireCopper: "8 AWG", wireAluminum: "6 AWG", busCopperMm2: 8.5, busAluminumMm2: 10.5 },
  { ocpNotExceeding: 200, wireCopper: "6 AWG", wireAluminum: "4 AWG", busCopperMm2: 10.5, busAluminumMm2: 21.0 },
  { ocpNotExceeding: 300, wireCopper: "4 AWG", wireAluminum: "2 AWG", busCopperMm2: 21.0, busAluminumMm2: 26.5 },
  { ocpNotExceeding: 400, wireCopper: "3 AWG", wireAluminum: "1 AWG", busCopperMm2: 26.5, busAluminumMm2: 33.5 },
  { ocpNotExceeding: 500, wireCopper: "2 AWG", wireAluminum: "1/0 AWG", busCopperMm2: 33.5, busAluminumMm2: 42.5 },
  { ocpNotExceeding: 600, wireCopper: "1 AWG", wireAluminum: "2/0 AWG", busCopperMm2: 42.5, busAluminumMm2: 53.5 },
  { ocpNotExceeding: 800, wireCopper: "1/0 AWG", wireAluminum: "3/0 AWG", busCopperMm2: 53.5, busAluminumMm2: 67.5 },
  { ocpNotExceeding: 1000, wireCopper: "2/0 AWG", wireAluminum: "4/0 AWG", busCopperMm2: 67.5, busAluminumMm2: 84.0 },
  { ocpNotExceeding: 1200, wireCopper: "3/0 AWG", wireAluminum: "250 kcmil", busCopperMm2: 84.0, busAluminumMm2: 127.0 },
  { ocpNotExceeding: 1600, wireCopper: "4/0 AWG", wireAluminum: "350 kcmil", busCopperMm2: 107.0, busAluminumMm2: 177.5 },
  { ocpNotExceeding: 2000, wireCopper: "250 kcmil", wireAluminum: "400 kcmil", busCopperMm2: 127.5, busAluminumMm2: 203.0 },
  { ocpNotExceeding: 2500, wireCopper: "350 kcmil", wireAluminum: "500 kcmil", busCopperMm2: 177.5, busAluminumMm2: 253.5 },
  { ocpNotExceeding: 3000, wireCopper: "400 kcmil", wireAluminum: "600 kcmil", busCopperMm2: 203.0, busAluminumMm2: 355.0 },
  { ocpNotExceeding: 4000, wireCopper: "500 kcmil", wireAluminum: "800 kcmil", busCopperMm2: 253.5, busAluminumMm2: 405.5 },
  { ocpNotExceeding: 5000, wireCopper: "700 kcmil", wireAluminum: "1000 kcmil", busCopperMm2: 355.0, busAluminumMm2: 507.0 },
  { ocpNotExceeding: 6000, wireCopper: "800 kcmil", wireAluminum: "1250 kcmil", busCopperMm2: 405.5, busAluminumMm2: 633.5 }
];

function getBondingFromTable16ByOcp(ocpRatingA, conductorMaterial = "copper") {
  const ocp = Number(ocpRatingA);
  if (!Number.isFinite(ocp) || ocp <= 0) {
    return {
      applicable: false,
      reason: "Enter OCP Rating to determine bonding size per CSA Rule 10-616 / Table 16."
    };
  }

  const row = CSA_TABLE_16_BONDING_SIZES.find((entry) => ocp <= entry.ocpNotExceeding);
  if (!row) {
    return {
      applicable: false,
      reason: "OCP rating is above Table 16 range (6000 A). Engineering review required."
    };
  }

  const isAluminum = String(conductorMaterial).toLowerCase() === "aluminum";
  return {
    applicable: true,
    ocpRatingA: ocp,
    tableLimitA: row.ocpNotExceeding,
    wireSize: isAluminum ? row.wireAluminum : row.wireCopper,
    busSizeMm2: isAluminum ? row.busAluminumMm2 : row.busCopperMm2,
    wireMaterial: isAluminum ? "aluminum" : "copper",
    codeReference: "CSA Rule 10-616, Table 16",
    note: "For field-installed system bonding jumpers / bonding conductors where OCP-based sizing applies. Service bonding conductor sizing excluded."
  };
}

if (typeof window !== "undefined") {
  window.CSA_TABLE_16_BONDING_SIZES = CSA_TABLE_16_BONDING_SIZES;
  window.getBondingFromTable16ByOcp = getBondingFromTable16ByOcp;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CSA_TABLE_16_BONDING_SIZES,
    getBondingFromTable16ByOcp
  };
}
