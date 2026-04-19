# CSA C22.1:24 Cable Selection Form — Implementation Guide

## Quick Overview

This package contains a complete redesign of a cable sizing calculator form to be **CSA C22.1:24 compliant**, with proper separation between user-facing labels and internal calculation categories. Three documents are provided:

1. **CSA_Cable_Selection_Redesign_Spec.md** – Comprehensive specification (11 sections, ~2500 lines)
2. **csa_tables.js** – Extracted CSA ampacity & voltage drop tables in JavaScript format
3. **index.html** – Working HTML/CSS/JS example (dark-theme, responsive, form-controller pattern)

---

## What's Included

### 1. CSA_Cable_Selection_Redesign_Spec.md

**Purpose**: Complete design document covering UX, data models, mapping logic, validation, PDF export, and future enhancements.

**Key Sections**:
- **Section 1: UX Goals** – Why this redesign matters
- **Section 2: Recommended UI Layout** – Two-column form structure with field grouping
- **Section 3: Revised Field List** – All form fields (7 categories, ~30 fields)
- **Section 4: Installation Type Selector** – Central control; determines CSA table & visible fields
- **Section 5: Helper Text** – Inline descriptions for every field (copy-paste ready)
- **Section 6: JavaScript Data Model** – Form state structure and derived calculations
- **Section 7: Mapping Logic** – Installation type → CSA table, field visibility rules
- **Section 8: Validation Rules** – Required fields, cross-field constraints
- **Section 9: Future Enhancements** – Bonding, grounding, parallel conductors, multi-circuit
- **Section 10: Final Recommended Structure** – File organization, HTML skeleton, CSS variables
- **Section 11: PDF Export** – Example report structure with calculation steps and citations

**How to Use**:
- Reference for any design questions or deviations
- Copy helper text directly into form labels
- Use data model as blueprint for state management
- Adapt validation rules to your framework

---

### 2. csa_tables.js

**Purpose**: CSA Tables 1–5A and D3 in JavaScript format, with lookup functions.

**Contents**:
- **CSA_TABLE_1_COPPER_FREE_AIR** – Single copper conductors, free air (28 sizes, 6 temp ratings)
- **CSA_TABLE_2_COPPER_RACEWAY_CABLE** – Copper in raceway/cable (28 sizes, 6 temp ratings)
- **CSA_TABLE_3_ALUMINUM_FREE_AIR** – Single aluminum conductors, free air
- **CSA_TABLE_4_ALUMINUM_RACEWAY_CABLE** – Aluminum in raceway/cable
- **CSA_TABLE_5A_CORRECTION_FACTORS** – Temperature derating (ambient 30–140°C vs. insulation 60–250°C)
- **CSA_TABLE_D3_VOLTAGE_DROP_K** – K values for VD calculation (copper & aluminum, cable & raceway)

**Lookup Functions**:
- `getAmpacityFromTable(size, material, installationType, insulationRating)` → ampacity in amps
- `getCorrectionFactorFromTable(ambientC, insulationRatingC)` → factor 0.0–1.0
- `getKValueFromTable(size, material, powerFactor, installationType)` → K value (Ω/km)
- `calculateVoltageDrop(current, kValue, lengthM)` → voltage drop in volts
- `calculateVoltageDropPercent(voltageDrop, sourceVoltage)` → percentage

**How to Use**:
1. Include in your HTML: `<script src="csa_tables.js"></script>`
2. Call lookup functions from your calculation module
3. All data is accessible globally (or via module.exports for Node.js)

**Data Format Example**:
```javascript
// Each table row is an object with size and temperature columns
{ size: "4 AWG", "60C": 70, "75C": 85, "90C": 95, "110C": 105, "125C": 115, "200C": 140 }

// Power factor and installation type are encoded as keys
{ size: "4", dc: 1.01, "100pf_cable": 1.01, "90pf_cable": 1.01, "80pf_cable": 0.987, ... }
```

---

### 3. index.html

**Purpose**: Working example showing form structure, dark-theme CSS, and JavaScript controller pattern.

**Features**:
- ✅ Two-column layout (Circuit Info | Installation Category | Conductors | Results)
- ✅ Dark theme with CSS variables (easily customizable)
- ✅ Installation type radio buttons with descriptions
- ✅ Conditional field visibility (show/hide based on type selection)
- ✅ Form validation and cross-field checking
- ✅ Results panel with formatted output
- ✅ Responsive design (adapts to mobile)
- ✅ Print-friendly styles
- ✅ CableSelectionController class (state management + calculations)

**How to Use**:
1. Open `index.html` in a browser to see the form in action
2. Test the installation type selector (radio buttons) to see conditional fields appear/disappear
3. Click "Calculate" to run the placeholder calculation and see results panel
4. Inspect the JavaScript to understand the controller pattern

**Integration Points**:
- Replace placeholder calculation logic with real ampacity/VD algorithms
- Connect to your backend API if needed
- Customize CSS colors/fonts for your design
- Extend form fields for your specific use case

---

## Implementation Checklist

### Phase 1: Validation & Data Model (2–3 days)

- [ ] Review `CSA_Cable_Selection_Redesign_Spec.md` Section 6 (JavaScript Data Model)
- [ ] Create state management (choose: plain JS object, Redux, Vuex, etc.)
- [ ] Implement validation rules from Section 8
- [ ] Add error message display on form (e.g., red borders, inline errors)
- [ ] Test: form accepts/rejects inputs per validation rules

### Phase 2: Field Visibility & Installation Type Logic (1–2 days)

- [ ] Implement `updateFieldVisibility()` based on installation type selection
- [ ] Test: selecting "Cable" shows cable_type field, hides raceway/free_air fields
- [ ] Test: selecting "Raceway" shows raceway fields, auto-hides others
- [ ] Test: form data updates correctly when switching types

### Phase 3: Core Calculation Engine (3–5 days)

- [ ] Integrate `csa_tables.js` into your app
- [ ] Implement conductor size iteration algorithm:
  1. Start with smallest size (14 AWG or equivalent)
  2. For each size: look up ampacity, apply Table 5A correction
  3. If ampacity ≥ required current, check voltage drop
  4. Get K value from Table D3, calculate VD
  5. If VD ≤ max allowed, return this size; otherwise, try next larger
- [ ] Test: results match CSA code book lookups (spot-check 5–10 scenarios)
- [ ] Verify correction factor application (Table 5A)
- [ ] Verify voltage drop formula: VD = (I × K × L) / 1000

### Phase 4: Results Display & Export (2–3 days)

- [ ] Display recommended size, ampacity, voltage drop in results panel
- [ ] Add PDF export (use jsPDF library or similar)
- [ ] Include in PDF: form inputs, calculation steps, CSA table references
- [ ] Test: PDF renders correctly, includes all required information

### Phase 5: Integration with Existing App (1–2 days)

- [ ] Extract form HTML and CSS into your template structure
- [ ] Connect form to your existing styling/theme
- [ ] Test: form works within your app's layout and navigation
- [ ] Test: results integrate with downstream workflows (bonding, grounding, ordering, etc.)

### Phase 6: Testing & Refinement (2–3 days)

- [ ] Unit tests: validation, calculation, field visibility
- [ ] Integration tests: full workflow (fill form → calculate → export)
- [ ] Edge cases: extreme ambient temps, very long runs, small/large currents
- [ ] User testing: novices and experienced electricians
- [ ] Accessibility: ARIA labels, keyboard navigation, color contrast

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│ USER: Fills Form                                             │
│ • Circuit info (voltage, current, length, VD limit)         │
│ • Electrical system (ambient, power factor)                 │
│ • Installation type (cable / raceway / free air)            │
│ • Conductor properties (material, size options, insulation) │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ FORM CONTROLLER: Validate & Extract                          │
│ • Check all required fields populated                        │
│ • Map form fields → internal data model                      │
│ • Convert units (feet → meters, °F → °C)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ CALCULATION ENGINE: Ampacity & Voltage Drop                  │
│                                                              │
│ Step 1: Determine CSA Table (from installation type)        │
│   • cable/raceway copper → Table 2                          │
│   • free air copper → Table 1                               │
│   • (similar for aluminum → Tables 4 & 3)                   │
│                                                              │
│ Step 2: Get Temperature Correction Factor (Table 5A)        │
│   • Lookup: (ambient_temp_c, insulation_rating_c)          │
│   • Returns factor 0.0–1.0                                  │
│                                                              │
│ Step 3: Iterate Through Conductor Sizes                     │
│   For each size from smallest to largest:                   │
│     • Look up base ampacity from CSA table                 │
│     • Adjusted ampacity = base × correction factor         │
│     • If adjusted_ampacity < required_current:             │
│         Continue to next larger size                       │
│     • Get K value from Table D3 (based on size, material,  │
│       PF, installation type)                               │
│     • Calculate voltage drop: VD = (I×K×L)/1000           │
│     • If VD% ≤ max_voltage_drop:                           │
│         FOUND! Return this size                            │
│     • Else: Continue to next size                          │
│                                                              │
│ Step 4: Calculate Final Metrics                             │
│   • Recommended size (AWG or mm²)                           │
│   • Final ampacity (base × correction)                      │
│   • Voltage drop (V and %)                                  │
│   • Bonding size (future: Rule 4-022)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ RESULTS DISPLAY: Show Recommendations                        │
│ • Recommended conductor size                                 │
│ • Available ampacity (at selected insulation rating)        │
│ • Load current vs. ampacity margin                          │
│ • Voltage drop (V and %)                                    │
│ • CSA table reference                                        │
│ • Temperature correction factor                              │
│ • (Future: bonding, grounding, equipment derating)         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ PDF EXPORT: Generate Report                                 │
│ • Input summary (form data)                                 │
│ • Calculation steps with table references                   │
│ • Results summary                                            │
│ • CSA rule citations                                         │
│ • Assumptions & methodology notes                           │
└──────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions & Rationale

### 1. Installation Type as Primary Control

**Decision**: Installation Category is a radio button selector (not hidden in an "Advanced" section).

**Rationale**:
- It's the most important input; it determines which CSA table is used
- Electricians select it first (they know: "I'm running cable" vs. "I'm running individual conductors in conduit")
- Hiding it would force users to guess the correct setting

### 2. Field Visibility Logic

**Decision**: Conditional fields (cable_type, raceway_type, free_air_mounting) appear/disappear based on installation type.

**Rationale**:
- Reduces cognitive load; users only see relevant options
- Prevents "why is this disabled?" confusion
- Matches mental model: "If I select cable, I configure the cable; if I select raceway, I configure the conduit."

### 3. Temperature Correction as Automatic

**Decision**: Table 5A correction factor is calculated automatically, not a user input.

**Rationale**:
- Novice users don't know about Table 5A; it's easy to forget
- Automatic application prevents underestimation of voltage drop
- Can be overridden in "Special Conditions" textarea if needed

### 4. Helper Text on Form, Not Tooltips

**Decision**: Helper text appears below fields; tooltips (info icons) are minimal.

**Rationale**:
- Text is always visible (no hover required on mobile)
- Fits within typical form field width
- Professional, not "cute"

### 5. Metric (m, °C) as Default, Imperial (ft, °F) as Option

**Decision**: Metric is the default; user can switch to feet/Fahrenheit.

**Rationale**:
- CSA standard uses metric
- Canada uses metric
- Easier for international users
- Professional engineering practices favor metric

### 6. JSON Export Preparation (Future)

**Decision**: Form data structure is designed for easy JSON export for archiving/compliance.

**Rationale**:
- Electrical projects may require documentation
- JSON allows version control (Git-friendly)
- Easy to convert to CSV, PDF, or other formats

---

## Common Integration Challenges & Solutions

### Challenge 1: "How do I handle units conversion?"

**Solution**: Create a utility module:
```javascript
const UnitConverter = {
  feetToMeters: (ft) => ft * 0.3048,
  metersToFeet: (m) => m / 0.3048,
  fahrenheitToCelsius: (f) => (f - 32) * 5 / 9,
  celsiusToFahrenheit: (c) => (c * 9 / 5) + 32
};

// On form submit, normalize all inputs to metric
const runLengthM = this.form.circuit.run_length_unit === "ft"
  ? UnitConverter.feetToMeters(this.form.circuit.run_length)
  : this.form.circuit.run_length;
```

### Challenge 2: "How do I iterate through conductor sizes efficiently?"

**Solution**: Pre-sort the CSA table by size, then iterate:
```javascript
const sortedSizes = CSA_TABLE_2_COPPER_RACEWAY_CABLE.map(r => r.size)
  .sort((a, b) => parseFloat(a) - parseFloat(b));

for (const size of sortedSizes) {
  const ampacity = getAmpacityFromTable(size, material, installationType, insulationRating);
  const adjustedAmpacity = ampacity * correctionFactor;
  if (adjustedAmpacity >= requiredCurrent) {
    const kValue = getKValueFromTable(size, material, powerFactor, installationType);
    const vdPercent = (calculateVoltageDrop(current, kValue, length) / sourceVoltage) * 100;
    if (vdPercent <= maxVdPercent) {
      return size;  // Found!
    }
  }
}
```

### Challenge 3: "What if the user selects an installation type that doesn't have valid sizes?"

**Solution**: Validate after size selection:
```javascript
function validateSizeAvailable(size, material, installationType, insulationRating) {
  const ampacity = getAmpacityFromTable(size, material, installationType, insulationRating);
  return ampacity !== null;
}

// After size selection, check:
if (!validateSizeAvailable(selectedSize, material, installationType, insulationRating)) {
  showError("Selected size not available for this configuration. Try different settings.");
}
```

### Challenge 4: "How do I display the PDF report cleanly?"

**Solution**: Use a template approach:
```javascript
function generatePdfContent(formData, results) {
  return `
    <h2>CABLE SIZING REPORT</h2>
    <h3>Input Summary</h3>
    <dl>
      <dt>Circuit Type</dt>
      <dd>${formData.circuit.type}</dd>
      <dt>Voltage</dt>
      <dd>${formData.circuit.voltage_v} V</dd>
      ...
    </dl>
    <h3>Calculation Steps</h3>
    <ol>
      <li>CSA Table: ${results.csa_table_ref}</li>
      <li>Correction Factor: ${results.correction_factor} (Table 5A)</li>
      ...
    </ol>
    <h3>Results</h3>
    <dl>
      <dt>Recommended Size</dt>
      <dd>${results.recommended_size_awg}</dd>
      ...
    </dl>
  `;
}

// Then convert HTML to PDF with jsPDF or Puppeteer
```

### Challenge 5: "How do I test the calculation against the code book?"

**Solution**: Create a test suite:
```javascript
// Test: 4 AWG copper, Table 2, 90°C, 30°C ambient
const ampacity = getAmpacityFromTable("4", "copper", "raceway", 90);
console.assert(ampacity === 95, "Expected 95 A for 4 AWG at 90°C in Table 2");

// Test: Table 5A correction at 40°C, 90°C insulation
const correction = getCorrectionFactorFromTable(40, 90);
console.assert(correction === 0.91, "Expected 0.91 at 40°C ambient, 90°C insulation");
```

---

## File Organization (Recommended)

```
my-cable-sizing-app/
├── index.html                          # Main page
├── css/
│   ├── variables.css                   # CSS variables (colors, spacing)
│   ├── base.css                        # Form, typography, dark theme
│   ├── components.css                  # Fieldsets, inputs, buttons
│   └── responsive.css                  # Mobile, tablet, print
├── js/
│   ├── app.js                          # Main entry point, router
│   ├── csa_tables.js                   # CSA Tables 1–5A, D3
│   ├── calculator.js                   # Calculation engine (iterations, lookups)
│   ├── form_controller.js              # Form state, validation, visibility
│   ├── pdf_export.js                   # PDF generation (jsPDF wrapper)
│   ├── unit_converter.js               # ft ↔ m, °F ↔ °C
│   └── utils.js                        # Helpers (format numbers, etc.)
├── data/
│   └── csa_tables.json                 # (Optional) CSA tables in JSON
├── tests/
│   ├── calculator.test.js              # Unit tests
│   └── integration.test.js             # Full workflow tests
├── docs/
│   ├── CSA_Cable_Selection_Redesign_Spec.md
│   ├── README_IMPLEMENTATION_GUIDE.md  # This file
│   └── API.md                          # (Future) API documentation
└── README.md                           # Project overview
```

---

## Testing Checklist

### Functional Tests

- [ ] **Form Validation**
  - [ ] Required fields show error when empty
  - [ ] Number fields reject non-numeric input
  - [ ] Ambient temp accepts 0–150°C (or 30–300°F)
  - [ ] Power factor accepts 0.5–1.0

- [ ] **Installation Type Logic**
  - [ ] Selecting "Cable" shows cable_type, hides raceway/free_air fields
  - [ ] Selecting "Raceway" shows raceway_type & conductors_in_run, hides others
  - [ ] Selecting "Free Air" shows mounting, hides cable/raceway fields

- [ ] **Ampacity Calculation**
  - [ ] 4 AWG copper, Table 2, 90°C, 30°C ambient → 95 A (base)
  - [ ] 4 AWG copper at 40°C ambient → 95 × 0.91 = 86.45 A (corrected)
  - [ ] Aluminum sizes are larger than copper for same ampacity
  - [ ] Increasing insulation rating increases ampacity (60°C < 75°C < 90°C)

- [ ] **Voltage Drop Calculation**
  - [ ] Formula: VD = (I × K × L) / 1000 ✓
  - [ ] 200 A, K=0.267, L=300 m → VD = 16.02 V ✓
  - [ ] VD% = (16.02 / 600) × 100 = 2.67% ✓
  - [ ] 3-phase load uses different K values than 1-phase
  - [ ] Power factor affects K value selection

- [ ] **Results Panel**
  - [ ] Displays recommended size, ampacity, VD when calculate clicked
  - [ ] Updates when inputs change and recalculate clicked
  - [ ] Shows "PASS" or "FAIL" status for constraints

- [ ] **PDF Export**
  - [ ] Exports all inputs
  - [ ] Includes calculation steps with table references
  - [ ] Renders without errors
  - [ ] Opens in PDF viewer

### Edge Cases

- [ ] Very long run (e.g., 500 m) → voltage drop dominates size selection
- [ ] Very high current (e.g., 1000 A) → ampacity dominates
- [ ] High ambient temp (e.g., 60°C) → significant ampacity reduction
- [ ] Small current (e.g., 10 A) → minimum size selected (14 AWG)
- [ ] Low power factor (0.75) → affects voltage drop
- [ ] Direct burial cable → ensure K values correct

### Regression Tests

- [ ] Compare results to NEC sizing tool (if applicable) — note differences
- [ ] Spot-check 5–10 real-world scenarios against manual CSA lookups
- [ ] Verify table values match code book (especially Table 5A)

---

## Future Enhancements (Documented in Section 9)

1. **Bonding Conductor Sizing** (Rule 4-022)
2. **Equipment Grounding** (Rule 4-024)
3. **Parallel Conductors** (Rule 4-029, with grouping deductions)
4. **Multi-Circuit Management** (grouping in same conduit, Table 5C)
5. **Direct Burial Specifics** (soil thermal derating, depth)
6. **Voltage Drop Optimization** (suggest minimum cost size)
7. **Cost Estimation** (material costs, time to install)
8. **Project Management Integration** (save designs, share with team, version control)

---

## Support & Resources

### CSA References

- **CSA C22.1:24** (March 2024 edition) – Official code
  - Table 1–4: Ampacity tables
  - Table 5A: Temperature correction factors
  - Table 5B/5C: Grouping deductions
  - Table D3: Voltage drop K values
  - Rule 4-004 through 4-029: Conductor sizing rules

### External Libraries (Recommended)

- **jsPDF** – PDF generation
  - `npm install jspdf`
  - [Link](https://github.com/parallax/jsPDF)

- **numeral.js** – Number formatting
  - `npm install numeral`
  - [Link](https://numeraljs.com/)

- **date-fns** – Date handling
  - `npm install date-fns`
  - [Link](https://date-fns.org/)

### Helpful Tools

- **CSA Online Code Lookup** – For verifying specific rules
- **Ohm's Law Calculator** – For sanity checks
- **Spreadsheet Template** – Create a CSV version for offline use

---

## Contact & Questions

If you have questions about:
- **Design decisions**: See Section 1 (UX Goals) and Section 10 (Final Structure)
- **Data model**: See Section 6 (JavaScript Data Model)
- **Calculations**: See Section 10 (PDF Export methodology) for detailed steps
- **Implementation**: See this guide's "Implementation Checklist" and "Common Challenges"

---

## License & Attribution

These documents and code are provided as-is for use in electrical design and CSA C22.1:24 compliance.

**CSA Table Data Source**: CSA C22.1:24 (March 2024 edition)
- Tables are transcribed directly from the code book
- Verify against official source for critical designs
- Do not rely on software alone; always cross-check with code book

---

## Version History

- **v1.0** (2025-04-19) – Initial release
  - CSA redesign specification
  - csa_tables.js with lookups
  - index.html working example
  - This implementation guide

---

**Last Updated**: April 19, 2025  
**Status**: Ready for Phase 1 implementation
