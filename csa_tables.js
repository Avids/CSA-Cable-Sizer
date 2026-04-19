/**
 * CSA C22.1:24 Ampacity Tables and Correction Factors
 * 
 * Source: CSA C22.1:24 (March 2024)
 * Tables: 1, 2, 3, 4 (ampacity), 5A (temperature correction), D3 (voltage drop K values)
 * 
 * All values extracted directly from the code book.
 * Use in conjunction with cableSelectionCalculator for sizing decisions.
 */

// ============================================================================
// TABLE 1: Ampacities for single copper conductors in free air
// ============================================================================
// Conditions: 5000 V or less, unshielded, single conductor in free air
// Basis: 30°C ambient temperature
// Reference: CSA Rule 4-004, 4-006, 26-142, 42-008, 42-016, Tables 5A, 5B, 19

const CSA_TABLE_1_COPPER_FREE_AIR = [
  // Format: { size, "60C": X, "75C": X, "90C": X, "110C": X, "125C": X, "200C": X }
  // Size labels: "14", "12", "10", "8", "6", "4", "3", "2", "1", "0", "00", "000", "0000",
  //              "250", "300", "350", "400", "500", "600", "700", "750", "800", "900", "1000",
  //              "1250", "1500", "1750", "2000"
  
  { size: "14", "60C": 25, "75C": 30, "90C": 35, "110C": 40, "125C": 40, "200C": 50 },
  { size: "12", "60C": 30, "75C": 35, "90C": 40, "110C": 45, "125C": 45, "200C": 55 },
  { size: "10", "60C": 40, "75C": 50, "90C": 55, "110C": 65, "125C": 65, "200C": 80 },
  { size: "8", "60C": 60, "75C": 70, "90C": 80, "110C": 90, "125C": 95, "200C": 115 },
  { size: "6", "60C": 80, "75C": 95, "90C": 105, "110C": 120, "125C": 130, "200C": 155 },
  { size: "4", "60C": 105, "75C": 125, "90C": 140, "110C": 160, "125C": 170, "200C": 205 },
  { size: "3", "60C": 120, "75C": 145, "90C": 165, "110C": 185, "125C": 195, "200C": 240 },
  { size: "2", "60C": 140, "75C": 170, "90C": 190, "110C": 215, "125C": 230, "200C": 280 },
  { size: "1", "60C": 165, "75C": 195, "90C": 220, "110C": 245, "125C": 265, "200C": 320 },
  { size: "0", "60C": 195, "75C": 230, "90C": 260, "110C": 290, "125C": 310, "200C": 375 },
  { size: "00", "60C": 220, "75C": 265, "90C": 300, "110C": 335, "125C": 355, "200C": 435 },
  { size: "000", "60C": 260, "75C": 310, "90C": 350, "110C": 390, "125C": 420, "200C": 510 },
  { size: "0000", "60C": 300, "75C": 360, "90C": 405, "110C": 455, "125C": 485, "200C": 590 },
  { size: "250", "60C": 340, "75C": 405, "90C": 455, "110C": 510, "125C": 545, "200C": null },
  { size: "300", "60C": 370, "75C": 445, "90C": 500, "110C": 560, "125C": 600, "200C": null },
  { size: "350", "60C": 425, "75C": 505, "90C": 570, "110C": 640, "125C": 680, "200C": null },
  { size: "400", "60C": 455, "75C": 545, "90C": 615, "110C": 690, "125C": 735, "200C": null },
  { size: "500", "60C": 520, "75C": 620, "90C": 700, "110C": 785, "125C": 835, "200C": null },
  { size: "600", "60C": 580, "75C": 690, "90C": 780, "110C": 870, "125C": 930, "200C": null },
  { size: "700", "60C": 630, "75C": 755, "90C": 850, "110C": 955, "125C": 1020, "200C": null },
  { size: "750", "60C": 655, "75C": 785, "90C": 885, "110C": 990, "125C": 1060, "200C": null },
  { size: "800", "60C": 680, "75C": 815, "90C": 920, "110C": 1030, "125C": 1100, "200C": null },
  { size: "900", "60C": 730, "75C": 870, "90C": 980, "110C": 1100, "125C": 1175, "200C": null },
  { size: "1000", "60C": 785, "75C": 935, "90C": 1055, "110C": 1180, "125C": 1260, "200C": null },
  { size: "1250", "60C": 890, "75C": 1065, "90C": 1200, "110C": 1345, "125C": null, "200C": null },
  { size: "1500", "60C": 985, "75C": 1175, "90C": 1325, "110C": 1485, "125C": null, "200C": null },
  { size: "1750", "60C": 1070, "75C": 1280, "90C": 1445, "110C": 1620, "125C": null, "200C": null },
  { size: "2000", "60C": 1160, "75C": 1385, "90C": 1560, "110C": 1750, "125C": null, "200C": null }
];

// ============================================================================
// TABLE 2: Ampacities for not more than 3 insulated copper conductors in 
//          raceway or cable (at 30°C ambient)
// ============================================================================

const CSA_TABLE_2_COPPER_RACEWAY_CABLE = [
  { size: "14", "60C": 15, "75C": 20, "90C": 25, "110C": 25, "125C": 30, "200C": 35 },
  { size: "12", "60C": 20, "75C": 25, "90C": 30, "110C": 30, "125C": 35, "200C": 40 },
  { size: "10", "60C": 30, "75C": 35, "90C": 40, "110C": 45, "125C": 45, "200C": 60 },
  { size: "8", "60C": 40, "75C": 50, "90C": 55, "110C": 65, "125C": 65, "200C": 80 },
  { size: "6", "60C": 55, "75C": 65, "90C": 75, "110C": 80, "125C": 90, "200C": 110 },
  { size: "4", "60C": 70, "75C": 85, "90C": 95, "110C": 105, "125C": 115, "200C": 140 },
  { size: "3", "60C": 85, "75C": 100, "90C": 115, "110C": 125, "125C": 135, "200C": 165 },
  { size: "2", "60C": 95, "75C": 115, "90C": 130, "110C": 145, "125C": 155, "200C": 190 },
  { size: "1", "60C": 110, "75C": 130, "90C": 145, "110C": 165, "125C": 175, "200C": 215 },
  { size: "0", "60C": 125, "75C": 150, "90C": 170, "110C": 190, "125C": 200, "200C": 245 },
  { size: "00", "60C": 145, "75C": 175, "90C": 195, "110C": 220, "125C": 235, "200C": 290 },
  { size: "000", "60C": 165, "75C": 200, "90C": 225, "110C": 255, "125C": 270, "200C": 330 },
  { size: "0000", "60C": 195, "75C": 230, "90C": 260, "110C": 290, "125C": 310, "200C": 380 },
  { size: "250", "60C": 215, "75C": 255, "90C": 290, "110C": 320, "125C": 345, "200C": null },
  { size: "300", "60C": 240, "75C": 285, "90C": 320, "110C": 360, "125C": 385, "200C": null },
  { size: "350", "60C": 260, "75C": 310, "90C": 350, "110C": 390, "125C": 420, "200C": null },
  { size: "400", "60C": 280, "75C": 335, "90C": 380, "110C": 425, "125C": 450, "200C": null },
  { size: "500", "60C": 320, "75C": 380, "90C": 430, "110C": 480, "125C": 510, "200C": null },
  { size: "600", "60C": 350, "75C": 420, "90C": 475, "110C": 530, "125C": 565, "200C": null },
  { size: "700", "60C": 385, "75C": 460, "90C": 520, "110C": 580, "125C": 620, "200C": null },
  { size: "750", "60C": 400, "75C": 475, "90C": 535, "110C": 600, "125C": 640, "200C": null },
  { size: "800", "60C": 410, "75C": 490, "90C": 555, "110C": 620, "125C": 660, "200C": null },
  { size: "900", "60C": 435, "75C": 520, "90C": 585, "110C": 655, "125C": 700, "200C": null },
  { size: "1000", "60C": 455, "75C": 545, "90C": 615, "110C": 690, "125C": 735, "200C": null },
  { size: "1250", "60C": 495, "75C": 590, "90C": 665, "110C": 745, "125C": null, "200C": null },
  { size: "1500", "60C": 525, "75C": 625, "90C": 705, "110C": 790, "125C": null, "200C": null },
  { size: "1750", "60C": 545, "75C": 650, "90C": 735, "110C": 820, "125C": null, "200C": null },
  { size: "2000", "60C": 555, "75C": 665, "90C": 750, "110C": 840, "125C": null, "200C": null }
];

// ============================================================================
// TABLE 3: Ampacities for single aluminum conductors in free air (at 30°C)
// ============================================================================

const CSA_TABLE_3_ALUMINUM_FREE_AIR = [
  { size: "12", "60C": 25, "75C": 30, "90C": 35, "110C": 40, "125C": 40, "200C": 50 },
  { size: "10", "60C": 35, "75C": 40, "90C": 45, "110C": 50, "125C": 55, "200C": 65 },
  { size: "8", "60C": 45, "75C": 55, "90C": 60, "110C": 70, "125C": 75, "200C": 90 },
  { size: "6", "60C": 65, "75C": 75, "90C": 85, "110C": 95, "125C": 100, "200C": 125 },
  { size: "4", "60C": 85, "75C": 100, "90C": 115, "110C": 125, "125C": 135, "200C": 165 },
  { size: "3", "60C": 95, "75C": 115, "90C": 130, "110C": 145, "125C": 155, "200C": 190 },
  { size: "2", "60C": 115, "75C": 135, "90C": 150, "110C": 170, "125C": 180, "200C": 220 },
  { size: "1", "60C": 130, "75C": 155, "90C": 175, "110C": 195, "125C": 210, "200C": 255 },
  { size: "0", "60C": 150, "75C": 180, "90C": 205, "110C": 225, "125C": 245, "200C": 295 },
  { size: "00", "60C": 175, "75C": 210, "90C": 235, "110C": 265, "125C": 285, "200C": 345 },
  { size: "000", "60C": 200, "75C": 240, "90C": 270, "110C": 305, "125C": 325, "200C": 395 },
  { size: "0000", "60C": 235, "75C": 280, "90C": 315, "110C": 355, "125C": 375, "200C": 460 },
  { size: "250", "60C": 265, "75C": 315, "90C": 355, "110C": 400, "125C": 425, "200C": null },
  { size: "300", "60C": 295, "75C": 350, "90C": 395, "110C": 440, "125C": 470, "200C": null },
  { size: "350", "60C": 330, "75C": 395, "90C": 445, "110C": 500, "125C": 535, "200C": null },
  { size: "400", "60C": 355, "75C": 425, "90C": 480, "110C": 535, "125C": 575, "200C": null },
  { size: "500", "60C": 405, "75C": 485, "90C": 545, "110C": 615, "125C": 655, "200C": null },
  { size: "600", "60C": 455, "75C": 545, "90C": 615, "110C": 690, "125C": 735, "200C": null },
  { size: "700", "60C": 500, "75C": 595, "90C": 670, "110C": 750, "125C": 800, "200C": null },
  { size: "750", "60C": 520, "75C": 620, "90C": 700, "110C": 785, "125C": 835, "200C": null },
  { size: "800", "60C": 540, "75C": 645, "90C": 725, "110C": 815, "125C": 870, "200C": null },
  { size: "900", "60C": 585, "75C": 700, "90C": 790, "110C": 885, "125C": 945, "200C": null },
  { size: "1000", "60C": 630, "75C": 750, "90C": 845, "110C": 950, "125C": 1010, "200C": null },
  { size: "1250", "60C": 715, "75C": 855, "90C": 965, "110C": 1080, "125C": null, "200C": null },
  { size: "1500", "60C": 795, "75C": 950, "90C": 1070, "110C": 1200, "125C": null, "200C": null },
  { size: "1750", "60C": 880, "75C": 1050, "90C": 1185, "110C": 1325, "125C": null, "200C": null },
  { size: "2000", "60C": 965, "75C": 1150, "90C": 1295, "110C": 1455, "125C": null, "200C": null }
];

// ============================================================================
// TABLE 4: Ampacities for not more than 3 insulated aluminum conductors in
//          raceway or cable (at 30°C)
// ============================================================================

const CSA_TABLE_4_ALUMINUM_RACEWAY_CABLE = [
  { size: "12", "60C": 15, "75C": 20, "90C": 25, "110C": 25, "125C": 25, "200C": 35 },
  { size: "10", "60C": 25, "75C": 30, "90C": 35, "110C": 40, "125C": 40, "200C": 50 },
  { size: "8", "60C": 35, "75C": 40, "90C": 45, "110C": 50, "125C": 55, "200C": 65 },
  { size: "6", "60C": 40, "75C": 50, "90C": 55, "110C": 65, "125C": 70, "200C": 80 },
  { size: "4", "60C": 55, "75C": 65, "90C": 75, "110C": 80, "125C": 90, "200C": 105 },
  { size: "3", "60C": 65, "75C": 75, "90C": 85, "110C": 95, "125C": 100, "200C": 125 },
  { size: "2", "60C": 75, "75C": 90, "90C": 100, "110C": 115, "125C": 120, "200C": 150 },
  { size: "1", "60C": 85, "75C": 100, "90C": 115, "110C": 125, "125C": 135, "200C": 165 },
  { size: "0", "60C": 100, "75C": 120, "90C": 135, "110C": 150, "125C": 160, "200C": 195 },
  { size: "00", "60C": 115, "75C": 135, "90C": 150, "110C": 170, "125C": 180, "200C": 220 },
  { size: "000", "60C": 130, "75C": 155, "90C": 175, "110C": 195, "125C": 210, "200C": 255 },
  { size: "0000", "60C": 150, "75C": 180, "90C": 205, "110C": 225, "125C": 245, "200C": 295 },
  { size: "250", "60C": 170, "75C": 205, "90C": 230, "110C": 260, "125C": 275, "200C": null },
  { size: "300", "60C": 195, "75C": 230, "90C": 260, "110C": 290, "125C": 310, "200C": null },
  { size: "350", "60C": 210, "75C": 250, "90C": 280, "110C": 315, "125C": 335, "200C": null },
  { size: "400", "60C": 225, "75C": 270, "90C": 305, "110C": 340, "125C": 365, "200C": null },
  { size: "500", "60C": 260, "75C": 310, "90C": 350, "110C": 390, "125C": 420, "200C": null },
  { size: "600", "60C": 285, "75C": 340, "90C": 385, "110C": 430, "125C": 460, "200C": null },
  { size: "700", "60C": 315, "75C": 375, "90C": 425, "110C": 475, "125C": 505, "200C": null },
  { size: "750", "60C": 320, "75C": 385, "90C": 435, "110C": 485, "125C": 520, "200C": null },
  { size: "800", "60C": 330, "75C": 395, "90C": 445, "110C": 500, "125C": 535, "200C": null },
  { size: "900", "60C": 355, "75C": 425, "90C": 480, "110C": 535, "125C": 575, "200C": null },
  { size: "1000", "60C": 375, "75C": 445, "90C": 500, "110C": 560, "125C": 600, "200C": null },
  { size: "1250", "60C": 405, "75C": 485, "90C": 545, "110C": 615, "125C": null, "200C": null },
  { size: "1500", "60C": 435, "75C": 520, "90C": 585, "110C": 655, "125C": null, "200C": null },
  { size: "1750", "60C": 455, "75C": 545, "90C": 615, "110C": 690, "125C": null, "200C": null },
  { size: "2000", "60C": 470, "75C": 560, "90C": 630, "110C": 710, "125C": null, "200C": null }
];

// ============================================================================
// TABLE 5A: Temperature Correction Factors
// ============================================================================
// Multiply ampacity from Tables 1–4 by the factor corresponding to ambient
// temperature and insulation rating. Example: If ambient = 40°C and insulation
// is 90°C, multiply base ampacity by 0.91.

const CSA_TABLE_5A_CORRECTION_FACTORS = [
  // Format: { ambient_c, "60": X, "75": X, "90": X, "105": X, "110": X, "125": X, "150": X, "200": X, "250": X }
  { ambient_c: 30, "60": 1.00, "75": 1.00, "90": 1.00, "105": 1.00, "110": 1.00, "125": 1.00, "150": 1.00, "200": 1.00, "250": 1.00 },
  { ambient_c: 35, "60": 0.91, "75": 0.94, "90": 0.96, "105": 0.97, "110": 0.97, "125": 0.97, "150": 0.98, "200": 0.99, "250": 0.99 },
  { ambient_c: 40, "60": 0.82, "75": 0.88, "90": 0.91, "105": 0.93, "110": 0.94, "125": 0.95, "150": 0.96, "200": 0.97, "250": 0.98 },
  { ambient_c: 45, "60": 0.71, "75": 0.82, "90": 0.87, "105": 0.89, "110": 0.90, "125": 0.92, "150": 0.94, "200": 0.95, "250": 0.97 },
  { ambient_c: 50, "60": 0.58, "75": 0.75, "90": 0.82, "105": 0.86, "110": 0.87, "125": 0.89, "150": 0.91, "200": 0.94, "250": 0.95 },
  { ambient_c: 55, "60": 0.41, "75": 0.67, "90": 0.76, "105": 0.82, "110": 0.83, "125": 0.86, "150": 0.89, "200": 0.92, "250": 0.94 },
  { ambient_c: 60, "60": null, "75": 0.58, "90": 0.71, "105": 0.77, "110": 0.79, "125": 0.83, "150": 0.87, "200": 0.91, "250": 0.93 },
  { ambient_c: 65, "60": null, "75": 0.47, "90": 0.65, "105": 0.73, "110": 0.75, "125": 0.79, "150": 0.84, "200": 0.89, "250": 0.92 },
  { ambient_c: 70, "60": null, "75": 0.33, "90": 0.58, "105": 0.68, "110": 0.71, "125": 0.76, "150": 0.82, "200": 0.87, "250": 0.90 },
  { ambient_c: 75, "60": null, "75": null, "90": 0.50, "105": 0.63, "110": 0.66, "125": 0.73, "150": 0.79, "200": 0.86, "250": 0.89 },
  { ambient_c: 80, "60": null, "75": null, "90": 0.41, "105": 0.58, "110": 0.61, "125": 0.69, "150": 0.76, "200": 0.84, "250": 0.88 },
  { ambient_c: 90, "60": null, "75": null, "90": null, "105": 0.45, "110": 0.50, "125": 0.61, "150": 0.71, "200": 0.80, "250": 0.85 },
  { ambient_c: 100, "60": null, "75": null, "90": null, "105": 0.26, "110": 0.35, "125": 0.51, "150": 0.65, "200": 0.77, "250": 0.83 },
  { ambient_c: 110, "60": null, "75": null, "90": null, "105": null, "110": null, "125": 0.40, "150": 0.58, "200": 0.73, "250": 0.80 },
  { ambient_c: 120, "60": null, "75": null, "90": null, "105": null, "110": null, "125": 0.23, "150": 0.50, "200": 0.69, "250": 0.77 },
  { ambient_c: 130, "60": null, "75": null, "90": null, "105": null, "110": null, "125": null, "150": 0.41, "200": 0.64, "250": 0.74 },
  { ambient_c: 140, "60": null, "75": null, "90": null, "105": null, "110": null, "125": null, "150": 0.29, "200": 0.59, "250": 0.71 }
];

// ============================================================================
// TABLE D3: K Values for Voltage Drop Calculation
// ============================================================================
// Used with formula: VD (V) = I × K × L / 1000
// where I = current (A), K = factor from table, L = length (km)
// 
// Conditions: 2–4 insulated conductors in cable or raceway, 75°C operating temp
// Different columns for power factor and installation type (cable vs. raceway)
// Reference: Appendix B

const CSA_TABLE_D3_VOLTAGE_DROP_K = {
  copper: [
    // Format: { size, "dc": X, "100pf_cable": X, "90pf_cable": X, ... }
    { size: "14", dc: 10.2, "100pf_cable": 10.2, "90pf_cable": 9.92, "80pf_cable": 9.67, "90pf_raceway": 10, "80pf_raceway": 9.67 },
    { size: "12", dc: 6.38, "100pf_cable": 6.38, "90pf_cable": 6.25, "80pf_cable": 6.1, "90pf_raceway": 6.26, "80pf_raceway": 6.11 },
    { size: "10", dc: 4.03, "100pf_cable": 4.03, "90pf_cable": 3.96, "80pf_cable": 3.87, "90pf_raceway": 3.96, "80pf_raceway": 3.87 },
    { size: "8", dc: 2.54, "100pf_cable": 2.54, "90pf_cable": 2.5, "80pf_cable": 2.45, "90pf_raceway": 2.51, "80pf_raceway": 2.45 },
    { size: "6", dc: 1.59, "100pf_cable": 1.59, "90pf_cable": 1.58, "80pf_cable": 1.55, "90pf_raceway": 1.58, "80pf_raceway": 1.55 },
    { size: "4", dc: 1.01, "100pf_cable": 1.01, "90pf_cable": 1.01, "80pf_cable": 0.987, "90pf_raceway": 1.01, "80pf_raceway": 1 },
    { size: "3", dc: 0.792, "100pf_cable": 0.792, "90pf_cable": 0.797, "80pf_cable": 0.787, "90pf_raceway": 0.801, "80pf_raceway": 0.792 },
    { size: "2", dc: 0.626, "100pf_cable": 0.627, "90pf_cable": 0.636, "80pf_cable": 0.629, "90pf_raceway": 0.639, "80pf_raceway": 0.635 },
    { size: "1", dc: 0.5, "100pf_cable": 0.5, "90pf_cable": 0.512, "80pf_cable": 0.509, "90pf_raceway": 0.516, "80pf_raceway": 0.515 },
    { size: "1/0", dc: 0.395, "100pf_cable": 0.396, "90pf_cable": 0.41, "80pf_cable": 0.409, "90pf_raceway": 0.414, "80pf_raceway": 0.415 },
    { size: "2/0", dc: 0.314, "100pf_cable": 0.316, "90pf_cable": 0.331, "80pf_cable": 0.332, "90pf_raceway": 0.335, "80pf_raceway": 0.338 },
    { size: "3/0", dc: 0.249, "100pf_cable": 0.251, "90pf_cable": 0.267, "80pf_cable": 0.27, "90pf_raceway": 0.271, "80pf_raceway": 0.275 },
    { size: "4/0", dc: 0.197, "100pf_cable": 0.2, "90pf_cable": 0.217, "80pf_cable": 0.221, "90pf_raceway": 0.221, "80pf_raceway": 0.226 },
    { size: "250", dc: 0.167, "100pf_cable": 0.171, "90pf_cable": 0.188, "80pf_cable": 0.193, "90pf_raceway": 0.192, "80pf_raceway": 0.198 },
    { size: "300", dc: 0.14, "100pf_cable": 0.144, "90pf_cable": 0.162, "80pf_cable": 0.167, "90pf_raceway": 0.166, "80pf_raceway": 0.172 },
    { size: "350", dc: 0.12, "100pf_cable": 0.125, "90pf_cable": 0.143, "80pf_cable": 0.148, "90pf_raceway": 0.147, "80pf_raceway": 0.154 },
    { size: "400", dc: 0.105, "100pf_cable": 0.111, "90pf_cable": 0.129, "80pf_cable": 0.135, "90pf_raceway": 0.133, "80pf_raceway": 0.14 },
    { size: "500", dc: 0.0836, "100pf_cable": 0.0912, "90pf_cable": 0.11, "80pf_cable": 0.116, "90pf_raceway": 0.114, "80pf_raceway": 0.121 },
    { size: "600", dc: 0.0697, "100pf_cable": 0.0785, "90pf_cable": 0.0969, "80pf_cable": 0.104, "90pf_raceway": 0.101, "80pf_raceway": 0.109 },
    { size: "750", dc: 0.0558, "100pf_cable": 0.0668, "90pf_cable": 0.085, "80pf_cable": 0.0915, "90pf_raceway": 0.0889, "80pf_raceway": 0.097 },
    { size: "1000", dc: 0.0417, "100pf_cable": 0.0558, "90pf_cable": 0.0739, "80pf_cable": 0.0805, "90pf_raceway": 0.0778, "80pf_raceway": 0.086 }
  ],
  aluminum: [
    { size: "12", dc: 10.5, "100pf_cable": 10.5, "90pf_cable": 10.3, "80pf_cable": 10, "90pf_raceway": 10.3, "80pf_raceway": 9.99 },
    { size: "10", dc: 6.58, "100pf_cable": 6.58, "90pf_cable": 6.44, "80pf_cable": 6.28, "90pf_raceway": 6.45, "80pf_raceway": 6.29 },
    { size: "8", dc: 4.14, "100pf_cable": 4.14, "90pf_cable": 4.07, "80pf_cable": 3.97, "90pf_raceway": 4.07, "80pf_raceway": 3.98 },
    { size: "6", dc: 2.62, "100pf_cable": 2.62, "90pf_cable": 2.58, "80pf_cable": 2.52, "90pf_raceway": 2.58, "80pf_raceway": 2.53 },
    { size: "4", dc: 1.65, "100pf_cable": 1.65, "90pf_cable": 1.63, "80pf_cable": 1.6, "90pf_raceway": 1.64, "80pf_raceway": 1.61 },
    { size: "3", dc: 1.3, "100pf_cable": 1.31, "90pf_cable": 1.3, "80pf_cable": 1.27, "90pf_raceway": 1.3, "80pf_raceway": 1.28 },
    { size: "2", dc: 1.04, "100pf_cable": 1.04, "90pf_cable": 1.04, "80pf_cable": 1.02, "90pf_raceway": 1.04, "80pf_raceway": 1.03 },
    { size: "1", dc: 0.82, "100pf_cable": 0.82, "90pf_cable": 0.823, "80pf_cable": 0.812, "90pf_raceway": 0.827, "80pf_raceway": 0.818 },
    { size: "1/0", dc: 0.651, "100pf_cable": 0.652, "90pf_cable": 0.659, "80pf_cable": 0.652, "90pf_raceway": 0.663, "80pf_raceway": 0.657 },
    { size: "2/0", dc: 0.516, "100pf_cable": 0.517, "90pf_cable": 0.526, "80pf_cable": 0.522, "90pf_raceway": 0.53, "80pf_raceway": 0.528 },
    { size: "3/0", dc: 0.408, "100pf_cable": 0.409, "90pf_cable": 0.42, "80pf_cable": 0.419, "90pf_raceway": 0.424, "80pf_raceway": 0.425 },
    { size: "4/0", dc: 0.326, "100pf_cable": 0.327, "90pf_cable": 0.341, "80pf_cable": 0.341, "90pf_raceway": 0.345, "80pf_raceway": 0.347 },
    { size: "250", dc: 0.275, "100pf_cable": 0.277, "90pf_cable": 0.291, "80pf_cable": 0.293, "90pf_raceway": 0.295, "80pf_raceway": 0.299 },
    { size: "300", dc: 0.229, "100pf_cable": 0.231, "90pf_cable": 0.247, "80pf_cable": 0.249, "90pf_raceway": 0.25, "80pf_raceway": 0.255 },
    { size: "350", dc: 0.196, "100pf_cable": 0.199, "90pf_cable": 0.215, "80pf_cable": 0.218, "90pf_raceway": 0.219, "80pf_raceway": 0.224 },
    { size: "400", dc: 0.172, "100pf_cable": 0.175, "90pf_cable": 0.191, "80pf_cable": 0.195, "90pf_raceway": 0.195, "80pf_raceway": 0.201 },
    { size: "500", dc: 0.138, "100pf_cable": 0.141, "90pf_cable": 0.158, "80pf_cable": 0.163, "90pf_raceway": 0.162, "80pf_raceway": 0.168 },
    { size: "600", dc: 0.115, "100pf_cable": 0.119, "90pf_cable": 0.136, "80pf_cable": 0.142, "90pf_raceway": 0.14, "80pf_raceway": 0.147 },
    { size: "750", dc: 0.0916, "100pf_cable": 0.0968, "90pf_cable": 0.115, "80pf_cable": 0.121, "90pf_raceway": 0.119, "80pf_raceway": 0.126 },
    { size: "1000", dc: 0.0686, "100pf_cable": 0.0758, "90pf_cable": 0.0933, "80pf_cable": 0.0994, "90pf_raceway": 0.0973, "80pf_raceway": 0.105 }
  ]
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get ampacity from CSA table for a given conductor size, material, and rating
 * @param {string} size - Conductor size (e.g., "4 AWG", "6", "1/0")
 * @param {string} material - "copper" or "aluminum"
 * @param {string} installationType - "cable", "raceway", "free_air"
 * @param {number} insulationRating - 60, 75, 90, 110, 125, 200
 * @returns {number|null} Ampacity in amps, or null if not found
 */
function getAmpacityFromTable(size, material, installationType, insulationRating) {
  let table;

  if (installationType === "free_air") {
    table = material === "copper" ? CSA_TABLE_1_COPPER_FREE_AIR : CSA_TABLE_3_ALUMINUM_FREE_AIR;
  } else {
    // cable or raceway both use Table 2 or 4
    table = material === "copper" ? CSA_TABLE_2_COPPER_RACEWAY_CABLE : CSA_TABLE_4_ALUMINUM_RACEWAY_CABLE;
  }

  const row = table.find(r => r.size === size);
  if (!row) return null;

  const ratingKey = `${insulationRating}C`;
  return row[ratingKey] || null;
}

/**
 * Get temperature correction factor from Table 5A
 * @param {number} ambientC - Ambient temperature in Celsius
 * @param {number} insulationRatingC - Insulation rating in Celsius
 * @returns {number} Correction factor (0.0–1.0)
 */
function getCorrectionFactorFromTable(ambientC, insulationRatingC) {
  const row = CSA_TABLE_5A_CORRECTION_FACTORS.find(r => r.ambient_c === ambientC);
  if (!row) return 1.0;  // Default if ambient not in table

  const ratingKey = String(insulationRatingC);
  return row[ratingKey] || 1.0;
}

/**
 * Get voltage drop K value from Table D3
 * @param {string} size - Conductor size
 * @param {string} material - "copper" or "aluminum"
 * @param {number} powerFactor - 0.5–1.0 (or 1.0 for DC/resistive)
 * @param {string} installationType - "cable" or "raceway"
 * @returns {number} K value in Ω/km
 */
function getKValueFromTable(size, material, powerFactor, installationType) {
  const tableData = CSA_TABLE_D3_VOLTAGE_DROP_K[material];
  const row = tableData.find(r => r.size === size);
  if (!row) return 0;

  // Determine key based on power factor and installation type
  let key;
  if (installationType === "free_air") {
    // Free air does not have a separate key in Table D3; use cable as approximation
    installationType = "cable";
  }

  if (powerFactor === 1.0) {
    key = `100pf_${installationType}`;
  } else if (powerFactor >= 0.9) {
    key = `90pf_${installationType}`;
  } else if (powerFactor >= 0.8) {
    key = `80pf_${installationType}`;
  } else {
    key = `80pf_${installationType}`;  // Use 80% as fallback for lower PF
  }

  return row[key] || 0;
}

/**
 * Calculate voltage drop in volts
 * @param {number} current - Load current in amperes
 * @param {number} kValue - K value from Table D3
 * @param {number} lengthM - Run length in meters
 * @returns {number} Voltage drop in volts
 */
function calculateVoltageDrop(current, kValue, lengthM) {
  const lengthKm = lengthM / 1000;
  return (current * kValue * lengthKm);
}

/**
 * Calculate voltage drop percentage
 * @param {number} voltageDrop - Voltage drop in volts
 * @param {number} sourceVoltage - Source voltage in volts
 * @returns {number} Voltage drop as percentage
 */
function calculateVoltageDropPercent(voltageDrop, sourceVoltage) {
  return (voltageDrop / sourceVoltage) * 100;
}

// ============================================================================
// EXPORTS (for use in other modules)
// ============================================================================

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CSA_TABLE_1_COPPER_FREE_AIR,
    CSA_TABLE_2_COPPER_RACEWAY_CABLE,
    CSA_TABLE_3_ALUMINUM_FREE_AIR,
    CSA_TABLE_4_ALUMINUM_RACEWAY_CABLE,
    CSA_TABLE_5A_CORRECTION_FACTORS,
    CSA_TABLE_D3_VOLTAGE_DROP_K,
    getAmpacityFromTable,
    getCorrectionFactorFromTable,
    getKValueFromTable,
    calculateVoltageDrop,
    calculateVoltageDropPercent
  };
}
