# CSA C22.1:24 Cable Selection Form Redesign Specification

## Executive Summary

This specification reimagines the cable selection input form to be **CSA C22.1:24 compliant**, with clear separation between user-facing terminology and internal calculation categories. The redesign enforces CSA logic around three installation types (Cable, Raceway, Free Air), simplifies field organization, and prepares the app for ampacity, voltage drop, and bonding calculations.

---

## 1. UX Goals

### Primary Goals
1. **CSA Alignment**: User selections map cleanly to CSA Tables 1–4 and correction factors (Table 5A)
2. **Clarity**: Separate user-friendly labels from technical calculation categories
3. **Modularity**: Installation type controls which fields appear and which calculation tables are used
4. **Professional Appearance**: Suitable for electrical engineering firms and licensed electricians
5. **Preparedness**: Form structure supports ampacity, voltage drop, and bonding workflows downstream
6. **Compact UX**: Reduce cognitive load by grouping related fields and hiding advanced options until needed

### Secondary Goals
- Support metric (mm, °C) and imperial (AWG, feet, °F) input units
- Enable conditional field visibility based on installation type and circuit type
- Provide inline helper text without modal tooltips for quick reference
- Prepare for dark-theme UI integration
- Allow easy CSV/PDF export of calculation methodology

---

## 2. Recommended UI Layout

### Overall Structure: Two-Column Form Layout

```
┌─────────────────────────────────────────────────────────┐
│                    CABLE SIZING CALCULATOR              │
│                    CSA C22.1:24 Edition                 │
└─────────────────────────────────────────────────────────┘

┌─ CIRCUIT INFORMATION ────────────────────────┐  ┌─ INSTALLATION TYPE ─────────────┐
│  • Circuit Type (1-Ph AC / 3-Ph AC / DC)    │  │  • Installation Category*       │
│  • Voltage at Source (V)                     │  │    [Radio buttons or dropdown]  │
│  • Current (A)                               │  │    ○ Cable Assembly             │
│  • Length of Run (m or ft)                   │  │    ○ Single Conductors in      │
│  • Max Voltage Drop (%)                      │  │      Raceway (Conduit)         │
│                                              │  │    ○ Free Air / Overhead       │
└──────────────────────────────────────────────┘  └─────────────────────────────────┘

┌─ ELECTRICAL SYSTEM ──────────────────────────────┐
│  • Ambient Temperature (°C)                      │
│  • Power Factor (0.0 – 1.0, default 0.9)        │
│  • Load Type (Resistive / Inductive / Mixed)    │
└──────────────────────────────────────────────────┘

┌─ CONDUCTORS & INSTALLATION ──────────────────────────────────┐
│                                                              │
│  Conductor Type*              Installation Subtype*          │
│  [Dropdown: Copper / Al]      [Conditional dropdown]        │
│                                                              │
│  Number of Conductors*        Conduit Type                  │
│  [Input: 1–4]                 [Conditional dropdown]        │
│                                                              │
│  [If Cable selected:]                                       │
│  Cable Type: [TECK / ACWU / NMD / Direct Burial]           │
│                                                              │
│  [If Raceway selected:]                                     │
│  Raceway Type: [Steel / Aluminum / PVC]                    │
│  Conductors in Run: [Input: 1–10]                          │
│                                                              │
│  [If Free Air selected:]                                    │
│  Mounting: [Single / Grouped / Spaced]                     │
│  Surface Contact: [None / Masonry / Wood / Other]          │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─ CODE BASIS ──────────────────────────────────────────────────┐
│  • Insulation Rating*: [60°C / 75°C / 90°C / 110°C / 125°C]  │
│  • CSA Table Reference (auto-populated based on above)        │
│  • Notes & Deviations                                         │
└──────────────────────────────────────────────────────────────┘

┌─ RESULTS & EXPORT ───────────────────────────────────────────┐
│  [Calculate Button]  [Export to PDF]  [Clear Form]           │
└──────────────────────────────────────────────────────────────┘
```

### Layout Notes
- **Left Column**: Circuit parameters, electrical system properties (user inputs for load)
- **Right Column**: Installation type selector (primary control that unlocks/disables other fields)
- **Middle/Lower Section**: Conductor & installation details (changes based on installation type)
- **Bottom**: Code basis and export options

---

## 3. Revised Field List

### A. CIRCUIT INFORMATION
| Field ID | User Label | Input Type | CSA Ref | Notes |
|----------|-----------|-----------|---------|-------|
| `circuit_type` | Circuit Type | Dropdown | Rule 4-004 | Options: 1-Phase AC, 3-Phase AC, DC |
| `voltage_source` | Source Voltage (V) | Number | Table 1–4 | e.g., 120, 240, 347, 600, etc. |
| `current_load` | Load Current (A) | Number | Table 1–4 | Amperes at point of load |
| `run_length` | Length of Run | Number + Unit selector | Table D3 | Meters or feet; required for VD calc |
| `max_voltage_drop` | Maximum Voltage Drop (%) | Number | Rule 4-008 | Typical: 3–5%; stored internally as decimal |
| `load_type` | Load Type | Dropdown | N/A (informational) | Options: Resistive / Inductive / Mixed |
| `power_factor` | Power Factor | Number | Table D3 | Range: 0.50–1.0; default 0.9 |

### B. ELECTRICAL SYSTEM
| Field ID | User Label | Input Type | CSA Ref | Notes |
|----------|-----------|-----------|---------|-------|
| `ambient_temp_c` | Ambient Temperature (°C) | Number | Table 5A | Default 30°C; corrects ampacity |
| `ambient_temp_f` | Ambient Temperature (°F) | Number | Table 5A | Shown if using imperial units |
| `ambient_temp_unit` | Temperature Unit | Radio | N/A | °C or °F; controls display |

### C. INSTALLATION TYPE & CATEGORY (Primary Control)
| Field ID | User Label | Input Type | CSA Ref | Internal Value | Notes |
|----------|-----------|-----------|---------|--------|-------|
| `installation_type` | **Installation Category*** | Radio / Dropdown | Rule 4-006 | `cable` \| `raceway` \| `free_air` | **This field controls form visibility** |
| | | | | | Option 1: Cable (TECK, ACWU, NMD, Direct Burial) → `cable` |
| | | | | | Option 2: Single Conductors in Raceway (Conduit) → `raceway` |
| | | | | | Option 3: Free Air / Overhead → `free_air` |

### D. CONDUCTORS
| Field ID | User Label | Input Type | CSA Ref | Visibility | Notes |
|----------|-----------|-----------|---------|------------|-------|
| `conductor_material` | Conductor Material* | Dropdown | Table 1–4 | Always | Options: Copper / Aluminum |
| `num_conductors` | Number of Conductors* | Number | Table 2, 4 | Always | Range: 1–4; for parallel sets, see `num_parallels` |
| `num_parallels` | Parallel Sets | Number | Rule 4-029 | Always (advanced) | If > 1, duplicate conductor calculations |
| `insulation_rating` | Insulation Rating* | Dropdown | Table 1–4, 5A | Always | Options: 60°C / 75°C / 90°C / 110°C / 125°C |
| `correction_factor` | Temp. Correction Factor | Decimal | Table 5A | Calculated, read-only | Auto-computed from ambient temp & insulation rating |

### E. INSTALLATION SPECIFICS (Conditional)
#### If `installation_type = "cable"`:
| Field ID | User Label | Input Type | CSA Ref | Notes |
|----------|-----------|-----------|---------|-------|
| `cable_type` | Cable Type* | Dropdown | Rule 4-006 | Options: TECK / ACWU / NMD / Direct Burial |
| `cable_armor` | Armoring / Sheathing | Dropdown | N/A (informational) | e.g., Steel, Aluminum (auto-selected for TECK) |

#### If `installation_type = "raceway"`:
| Field ID | User Label | Input Type | CSA Ref | Notes |
|----------|-----------|-----------|---------|-------|
| `raceway_type` | Raceway Type* | Dropdown | Rule 4-006 | Options: Steel Conduit / Aluminum Conduit / PVC Conduit |
| `conductors_in_run` | Total Conductors in Raceway | Number | Table 5C (grouping) | 1–10+; used for grouping correction |
| `raceway_fill_pct` | Raceway Fill (%) | Decimal, read-only | Rule 12-906 | Informational; ~40% typical for 3-conductor runs |

#### If `installation_type = "free_air"`:
| Field ID | User Label | Input Type | CSA Ref | Notes |
|----------|-----------|-----------|---------|-------|
| `free_air_mounting` | Mounting Configuration* | Dropdown | Table 1 / Note 1 | Options: Single / Grouped / Spaced / On Masonry |
| `surface_contact` | Surface Material | Dropdown | Table 1, Note 1 | Masonry / Plaster / Wood / None; affects Table choice |

### F. CODE BASIS
| Field ID | User Label | Input Type | CSA Ref | Notes |
|----------|-----------|-----------|---------|-------|
| `csa_table_ref` | CSA Table Reference | Text, read-only | N/A | Auto-populated: "Table 1", "Table 2", "Table 3", "Table 4" |
| `ampacity_col` | Ampacity Column | Text, read-only | N/A | Shows which temperature column: 60°C, 75°C, 90°C, etc. |
| `special_notes` | Special Conditions / Deviations | Text area | Rule 2-030 | Optional; for Rule deviations or site-specific constraints |
| `calculation_notes` | Calculation Notes | Text area | N/A | User can add reasoning or project-specific notes |

### G. OUTPUT / RESULTS
| Field ID | User Label | Input Type | Purpose | Notes |
|----------|-----------|-----------|---------|-------|
| `recommended_size` | Recommended Conductor Size | Text, read-only | Display | e.g., "4 AWG" or "6 mm²" |
| `ampacity_available` | Available Ampacity (A) | Text, read-only | Display | After temp. correction |
| `voltage_drop_v` | Voltage Drop (V) | Text, read-only | Display | Calculated from Table D3 |
| `voltage_drop_pct` | Voltage Drop (%) | Text, read-only | Display | Compared against `max_voltage_drop` |
| `bonding_size` | Bonding Conductor Size | Text, read-only | Display (future) | Linked to Rule 4-022 |

---

## 4. Installation Type Selector

### Primary Control: Installation Category

#### A. User-Facing Options (Recommended Radio Button Layout)

```html
<fieldset class="installation-selector">
  <legend>Installation Category*</legend>
  <p class="fieldset-help">
    How are the conductors installed? This affects which CSA table is used.
  </p>

  <div class="radio-group">
    <label>
      <input type="radio" name="installation_type" value="cable" 
             aria-label="Cable Assembly">
      <span class="option-title">Cable Assembly</span>
      <span class="option-desc">
        TECK, ACWU, NMD, or direct burial cable (multi-conductor assembly)
      </span>
    </label>

    <label>
      <input type="radio" name="installation_type" value="raceway" 
             aria-label="Single Conductors in Raceway">
      <span class="option-title">Single Conductors in Raceway</span>
      <span class="option-desc">
        Individual RW90 or XHHW-2 conductors installed in steel/PVC conduit
      </span>
    </label>

    <label>
      <input type="radio" name="installation_type" value="free_air" 
             aria-label="Free Air">
      <span class="option-title">Free Air / Overhead</span>
      <span class="option-desc">
        Single or grouped conductors in free air or on surface of masonry
      </span>
    </label>
  </div>
</fieldset>
```

#### B. Internal Mapping

```javascript
const INSTALLATION_TYPE_MAP = {
  "cable": {
    label: "Cable Assembly",
    csa_table: "Table 2",  // For 3-conductor cable
    description: "Manufactured multi-conductor cable (TECK, ACWU, NMD, direct burial)",
    requires_fields: ["cable_type"],
    hides_fields: ["raceway_type", "conductors_in_run", "free_air_mounting", "surface_contact"]
  },
  "raceway": {
    label: "Single Conductors in Raceway",
    csa_table: "Table 2",  // For conductors in conduit
    description: "Individual conductors (RW90, XHHW-2) in raceway/conduit",
    requires_fields: ["raceway_type", "conductors_in_run"],
    hides_fields: ["cable_type", "free_air_mounting", "surface_contact"]
  },
  "free_air": {
    label: "Free Air / Overhead",
    csa_table: "Table 1",  // Single conductor, free air
    description: "Single or grouped conductors in free air or on surface",
    requires_fields: ["free_air_mounting"],
    hides_fields: ["cable_type", "raceway_type", "conductors_in_run"]
  }
};
```

#### C. Alternative Professional Labels (Choose One)

| Option | Use Case | Tone |
|--------|----------|------|
| "Installation Method" | More technical; implies CSA alignment | Professional |
| "Conductor Installation Type" | Emphasizes the conductor vs. cable distinction | Technical-Precise |
| "Installation Category" (Recommended) | Neutral, clear, and directly CSA-aligned | Standard |

#### D. Recommended Default & Tooltip

```javascript
const DEFAULT_INSTALLATION_TYPE = "cable";  // Most common; aligns with NEC habit

const INSTALLATION_TOOLTIP = 
  "Installation Category determines which CSA C22.1:24 table is used for ampacity. " +
  "Cable = manufactured assembly (e.g., TECK). " +
  "Raceway = single conductors in conduit. " +
  "Free Air = conductors exposed to air or on surface.";
```

---

## 5. Helper Text / Descriptions

### Inline Field Descriptions (Shown Below or Near Field Labels)

#### Circuit Information Section

**Circuit Type**
- "Select whether the load is powered by single-phase AC (120V/240V homes/offices), three-phase AC (commercial/industrial), or DC (specialty applications)."
- **CSA Ref**: Rule 4-004

**Source Voltage**
- "The voltage measured at the electrical service or distribution point feeding this circuit. Common values: 120V, 240V, 347V, 480V, 600V."
- **CSA Ref**: Table 1–4

**Load Current**
- "The current (in amperes) that the circuit must deliver. Use the largest expected steady-state load, or the full nameplate rating of the equipment."
- **CSA Ref**: Table 1–4

**Length of Run**
- "The total length of the conductor from the source to the load. Used to calculate voltage drop."
- **CSA Ref**: Table D3

**Maximum Voltage Drop**
- "The acceptable voltage drop as a percentage of the source voltage. Typical ranges: 3–5% per feeder, up to 5% combined feeder+branch. CSA recommends not exceeding Rule 4-008."
- **CSA Ref**: Rule 4-008

#### Electrical System Section

**Ambient Temperature**
- "The temperature around the conductors when fully loaded. Ambient ≠ air temp; typical indoor ambient is 30°C. Higher temps reduce ampacity—see Table 5A."
- **CSA Ref**: Table 5A

**Power Factor**
- "Ratio of real power to apparent power (0.0–1.0). Inductive loads (motors, ballasts) have PF < 1.0; resistive loads (heaters) have PF = 1.0. Used in voltage drop calculations."
- **CSA Ref**: Table D3

#### Installation Category

**Installation Category** (Radio/Dropdown)
- "Installation Category determines which CSA ampacity table applies. Cable = multi-conductor assembly (TECK, ACWU, NMD, direct burial). Raceway = single conductors in conduit. Free Air = conductors in air or on surface."
- **CSA Ref**: Rule 4-006, Tables 1–4

#### Conductor Fields

**Conductor Material**
- "Copper has lower resistance and is more common. Aluminum is lighter and lower cost but requires one size larger. CSA Tables 1–4 provide separate values."
- **CSA Ref**: Tables 1–4

**Number of Conductors**
- "In a cable or raceway: typically 2 (2-wire), 3 (3-wire), or 4 (3-wire + ground). If designing parallel sets, enter the number per set and specify parallel sets separately."
- **CSA Ref**: Tables 2, 4; Rule 4-029

**Insulation Rating**
- "The maximum temperature at which the conductor insulation is rated. Higher ratings allow higher ampacity. Common: 75°C (standard), 90°C (enhanced)."
- **CSA Ref**: Tables 1–4, 5A

#### Installation Specifics

**Cable Type** (If Cable Selected)
- "TECK = steel-armored, suitable for exposed/underground. ACWU = armored, CU armor. NMD = nonmetallic (interior residential). Direct Burial = rated for direct ground burial."
- **CSA Ref**: Rule 4-006

**Raceway Type** (If Raceway Selected)
- "Steel conduit = standard for industrial. Aluminum = lighter, corrosion-resistant. PVC = non-conductive, suitable for chemical/outdoor areas. Raceway affects voltage drop (Table D3 has separate columns)."
- **CSA Ref**: Table D3

**Total Conductors in Raceway** (If Raceway Selected)
- "Total number of conductors in this conduit run, including all phases, neutral, and ground. Used to apply grouping deduction per Table 5C."
- **CSA Ref**: Table 5C

**Free Air Mounting** (If Free Air Selected)
- "Determines ampacity. Single = one conductor. Grouped = multiple conductors touching. Spaced = multiple conductors separated. On masonry = single conductor on wall, may increase ampacity per Table 1, Note 1."
- **CSA Ref**: Table 1, Note 1

---

## 6. Internal JavaScript Data Model

### A. Core Data Structure

```javascript
/**
 * Installation type category (internal enum)
 */
const INSTALLATION_TYPE = {
  CABLE: "cable",      // CSA Tables 2, 4
  RACEWAY: "raceway",  // CSA Tables 2, 4
  FREE_AIR: "free_air" // CSA Tables 1, 3
};

/**
 * Conductor material
 */
const CONDUCTOR_MATERIAL = {
  COPPER: "copper",
  ALUMINUM: "aluminum"
};

/**
 * Main form data object
 */
const cableSelectionForm = {
  // Circuit Information
  circuit: {
    type: "3ph_ac",  // "1ph_ac", "3ph_ac", "dc"
    voltage_v: 600,  // source voltage in volts
    current_a: 200,  // load current in amperes
    run_length_m: 300,  // length in meters (convert from feet if needed)
    max_voltage_drop_pct: 3.0,  // 0–5 typically
    load_type: "inductive",  // "resistive", "inductive", "mixed"
    power_factor: 0.9  // 0.5–1.0
  },

  // Electrical System
  system: {
    ambient_temp_c: 30,  // Celsius (default per CSA)
    ambient_temp_unit: "c"  // "c" or "f"
  },

  // Installation Category (Primary Control)
  installation: {
    type: "cable",  // cable | raceway | free_air
    
    // If type = "cable"
    cable: {
      cable_type: "teck",  // "teck", "acwu", "nmd", "direct_burial"
      armor_type: "steel"  // auto-derived from cable_type
    },

    // If type = "raceway"
    raceway: {
      raceway_type: "steel",  // "steel", "aluminum", "pvc"
      conductors_in_run: 3,  // total in this raceway
      fill_percentage: 0.40  // calculated
    },

    // If type = "free_air"
    free_air: {
      mounting: "single",  // "single", "grouped", "spaced", "on_masonry"
      surface_contact: "none"  // "none", "masonry", "plaster", "wood"
    }
  },

  // Conductors
  conductors: {
    material: "copper",  // copper | aluminum
    quantity: 3,  // per set (2–4)
    parallel_sets: 1,  // 1, 2, 3... (Rule 4-029)
    insulation_rating_c: 90,  // 60, 75, 90, 110, 125
  },

  // Code Basis
  code_basis: {
    csa_standard: "C22.1:24",
    special_notes: "",
    calculation_notes: ""
  }
};
```

### B. Derived/Calculated Properties

```javascript
/**
 * Calculate or derive values based on primary inputs.
 * These are NOT form fields, but computed.
 */
const cableCalculation = {
  // Temperature Correction
  correction_factor: 0.95,  // from Table 5A, computed from ambient_temp_c + insulation_rating_c

  // CSA Table Selection
  csa_table_ref: "Table 2",  // Based on installation.type
  ampacity_column: "90",  // Based on insulation_rating_c
  
  // Results
  recommended_size_awg: "4 AWG",  // or "6 mm²"
  ampacity_available_a: 140,  // After correction
  voltage_drop_k_value: 0.101,  // From Table D3
  voltage_drop_v: 18.2,  // I × K × L / 1000
  voltage_drop_pct: 3.03,  // voltage_drop_v / circuit.voltage_v × 100
  
  // Bonding (Future)
  bonding_size_awg: "8 AWG"  // Per Rule 4-022 (future enhancement)
};
```

### C. Form State Management (Example)

```javascript
class CableSelectionController {
  constructor() {
    this.form = { ...cableSelectionForm };
    this.results = { ...cableCalculation };
  }

  /**
   * Update form field and trigger recalculation
   */
  updateField(path, value) {
    const keys = path.split(".");
    let obj = this.form;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;

    // Trigger validation and recalc
    this.validate();
    this.calculate();
  }

  /**
   * Validate form based on current installation type
   */
  validate() {
    const errors = [];
    
    // Required fields always
    if (!this.form.circuit.type) errors.push("Circuit type required");
    if (!this.form.circuit.voltage_v || this.form.circuit.voltage_v <= 0) {
      errors.push("Voltage must be > 0");
    }
    if (!this.form.circuit.current_a || this.form.circuit.current_a <= 0) {
      errors.push("Current must be > 0");
    }
    if (!this.form.conductors.material) errors.push("Conductor material required");
    if (!this.form.installation.type) errors.push("Installation type required");

    // Conditional required fields
    if (this.form.installation.type === "cable") {
      if (!this.form.installation.cable.cable_type) {
        errors.push("Cable type required");
      }
    } else if (this.form.installation.type === "raceway") {
      if (!this.form.installation.raceway.raceway_type) {
        errors.push("Raceway type required");
      }
      if (!this.form.installation.raceway.conductors_in_run || 
          this.form.installation.raceway.conductors_in_run < 1) {
        errors.push("Total conductors in raceway required");
      }
    } else if (this.form.installation.type === "free_air") {
      if (!this.form.installation.free_air.mounting) {
        errors.push("Free air mounting configuration required");
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Perform all calculations based on current form state
   */
  calculate() {
    const v = this.validate();
    if (!v.valid) {
      this.results = { error: "Form validation failed", details: v.errors };
      return;
    }

    // Step 1: Determine CSA table and column
    this.results.csa_table_ref = this._getCsaTableRef();
    this.results.ampacity_column = `${this.form.conductors.insulation_rating_c}°C`;

    // Step 2: Get temperature correction factor
    this.results.correction_factor = this._getCorrectionFactor();

    // Step 3: Get base ampacity from CSA table
    this.results.ampacity_base = this._getBaseAmpacity();

    // Step 4: Apply correction factor
    this.results.ampacity_available_a = 
      this.results.ampacity_base * this.results.correction_factor;

    // Step 5: Get K value for voltage drop
    this.results.voltage_drop_k_value = this._getKValue();

    // Step 6: Calculate voltage drop
    this.results.voltage_drop_v = this._calculateVoltageDrop();
    this.results.voltage_drop_pct = 
      (this.results.voltage_drop_v / this.form.circuit.voltage_v) * 100;

    // Step 7: Determine recommended size
    this.results.recommended_size_awg = this._selectConductorSize();

    // Step 8: Future—bonding conductor
    this.results.bonding_size_awg = this._calculateBondingSize();
  }

  /**
   * Return CSA table reference based on installation type
   */
  _getCsaTableRef() {
    const type = this.form.installation.type;
    const material = this.form.conductors.material;

    if (type === "free_air") {
      return material === "copper" ? "Table 1" : "Table 3";
    } else if (type === "cable" || type === "raceway") {
      return material === "copper" ? "Table 2" : "Table 4";
    }
    return "Unknown";
  }

  /**
   * Get temperature correction factor from Table 5A
   */
  _getCorrectionFactor() {
    const ambientC = this.form.system.ambient_temp_c;
    const insulationC = this.form.conductors.insulation_rating_c;

    // Load from CSA Table 5A (see csa_tables.js)
    return getCorrectionFactorFromTable(ambientC, insulationC);
  }

  /**
   * Get base ampacity from appropriate CSA table
   */
  _getBaseAmpacity() {
    // Placeholder; implementation depends on conductor size selection
    // For now, assume user inputs a size and we look it up
    return 140;  // Will be looked up from table
  }

  /**
   * Get K value from Table D3 based on conductor size, material, and installation
   */
  _getKValue() {
    const conductorSize = this.results.recommended_size_awg;
    const material = this.form.conductors.material;
    const installationType = this.form.installation.type;
    const pf = this.form.circuit.power_factor;

    // Load from CSA Table D3 (see csa_tables.js)
    return getKValueFromTable(conductorSize, material, installationType, pf);
  }

  /**
   * Calculate voltage drop in volts
   * Formula: VD = I × K × L / 1000
   * where I = current (A), K = factor, L = length (m)
   */
  _calculateVoltageDrop() {
    const I = this.form.circuit.current_a;
    const K = this.results.voltage_drop_k_value;
    const L = this.form.circuit.run_length_m;
    return (I * K * L) / 1000;
  }

  /**
   * Select minimum conductor size that satisfies both ampacity and voltage drop
   * (Iterative: try each size from smallest to largest)
   */
  _selectConductorSize() {
    const requiredAmpacity = this.form.circuit.current_a;
    const maxVoltageDrop = this.form.circuit.max_voltage_drop_pct;
    
    // Iterate through conductor sizes (6 mm², 8 mm², 10 mm², 4 AWG, etc.)
    // For each size:
    //   1. Look up ampacity from CSA table
    //   2. Apply correction factor
    //   3. If ampacity >= required, check voltage drop
    //   4. If voltage drop <= max, return this size
    //   5. Otherwise, try next larger size

    // Placeholder; full implementation in separate module
    return "4 AWG";
  }

  /**
   * Calculate bonding conductor size per CSA Rule 4-022 (future)
   */
  _calculateBondingSize() {
    // Rule 4-022 tables; future enhancement
    return "8 AWG";
  }

  /**
   * Export calculation summary as PDF
   */
  exportToPdf() {
    // See Section 10 for PDF export implementation
    return this.generatePdfReport();
  }
}
```

---

## 7. Mapping Logic

### A. Installation Type → CSA Table Mapping

```javascript
const INSTALLATION_TO_TABLE = {
  "cable": {
    copper: "Table 2",      // "Ampacities for not more than three insulated copper 
                            //  conductors in raceway or cable"
    aluminum: "Table 4"     // Aluminum equivalent
  },
  "raceway": {
    copper: "Table 2",      // Same as cable; single conductors in raceway
    aluminum: "Table 4"
  },
  "free_air": {
    copper: "Table 1",      // "Ampacities for single copper conductors in free air"
    aluminum: "Table 3"
  }
};

/**
 * Derive CSA table reference from form inputs
 */
function getCsaTableRef(installationType, conductorMaterial) {
  return INSTALLATION_TO_TABLE[installationType][conductorMaterial];
}
```

### B. Installation Type → Visible Fields Mapping

```javascript
const FIELD_VISIBILITY = {
  "cable": {
    show: ["cable_type"],
    hide: ["raceway_type", "conductors_in_run", "free_air_mounting", "surface_contact"]
  },
  "raceway": {
    show: ["raceway_type", "conductors_in_run"],
    hide: ["cable_type", "free_air_mounting", "surface_contact"]
  },
  "free_air": {
    show: ["free_air_mounting", "surface_contact"],
    hide: ["cable_type", "raceway_type", "conductors_in_run"]
  }
};

/**
 * Update form UI to show/hide fields based on installation type
 */
function updateFieldVisibility(installationType) {
  const visibility = FIELD_VISIBILITY[installationType];
  
  visibility.show.forEach(fieldId => {
    document.getElementById(fieldId)?.parentElement?.classList.remove("hidden");
  });

  visibility.hide.forEach(fieldId => {
    document.getElementById(fieldId)?.parentElement?.classList.add("hidden");
  });
}
```

### C. Insulation Rating → Ampacity Column Mapping

```javascript
const INSULATION_TO_COLUMN = {
  60: "60 °C",
  75: "75 °C",
  90: "90 °C",
  110: "110 °C",
  125: "125 °C",
  200: "200 °C"
};

function getAmpacityColumnLabel(insulationRatingC) {
  return INSULATION_TO_COLUMN[insulationRatingC] || "Unknown";
}
```

### D. Ambient Temperature → Correction Factor Mapping

```javascript
/**
 * Example: given ambient 40°C and insulation 90°C, 
 * return correction factor 0.91 (from Table 5A)
 */
function getCorrectionFactor(ambientC, insulationC) {
  const table = CSA_TABLE_5A;  // Loaded from csa_tables.js
  const row = table.find(r => r.ambient_c === ambientC);
  if (!row) return 1.0;  // Default if not found
  
  const columnKey = `insulation_${insulationC}`;
  return row[columnKey] || 1.0;
}
```

---

## 8. Validation Rules

### A. Required Field Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| `circuit.type` | Must be one of: 1ph_ac, 3ph_ac, dc | "Circuit type is required" |
| `circuit.voltage_v` | Must be > 0 and < 100000 | "Voltage must be between 1 and 99,999 V" |
| `circuit.current_a` | Must be > 0 and < 10000 | "Current must be between 1 and 9,999 A" |
| `circuit.run_length_m` | Must be > 0 and < 100000 | "Run length must be > 0 m" |
| `circuit.max_voltage_drop_pct` | Must be > 0 and ≤ 10 | "Max VD must be 0–10%" |
| `circuit.power_factor` | Must be 0.5–1.0 | "Power factor must be 0.5–1.0" |
| `conductors.material` | Must be copper or aluminum | "Conductor material is required" |
| `conductors.quantity` | Must be 1–4 | "Conductors must be 1–4" |
| `conductors.parallel_sets` | Must be ≥ 1 | "Parallel sets must be ≥ 1" |
| `conductors.insulation_rating_c` | Must be one of: 60, 75, 90, 110, 125, 200 | "Insulation rating must be 60–200°C" |
| `system.ambient_temp_c` | Must be 0–140°C (or 30–285°F) | "Ambient temp out of range" |
| `installation.type` | Must be cable, raceway, or free_air | "Installation type is required" |

### B. Conditional Field Validation

| Condition | Field | Rule | Error Message |
|-----------|-------|------|---------------|
| `installation.type == "cable"` | `installation.cable.cable_type` | Must be teck, acwu, nmd, or direct_burial | "Cable type is required" |
| `installation.type == "raceway"` | `installation.raceway.raceway_type` | Must be steel, aluminum, or pvc | "Raceway type is required" |
| `installation.type == "raceway"` | `installation.raceway.conductors_in_run` | Must be 1–10 | "Conductors in run must be 1–10" |
| `installation.type == "free_air"` | `installation.free_air.mounting` | Must be single, grouped, spaced, or on_masonry | "Mounting config is required" |

### C. Cross-Field Validation

| Rule | Error Message | Correction |
|------|---------------|-----------|
| Parallel sets > 1 AND conductors.quantity > 2 | "Warning: >2 conductors per parallel set may not be standard; confirm with design engineer" | Allow but warn |
| voltage_drop_pct > max_voltage_drop_pct | "Selected conductor size exceeds max voltage drop; recommend larger size" | Flag in results |
| ambient_temp_c > 50°C | "High ambient temp; confirm ventilation/cooling; ampacity will be severely derating" | Warn |
| current_a > (ampacity_available_a × 1.25) | "Load current exceeds conductor ampacity; select larger conductor" | Block calculation |

---

## 9. Future Enhancements

### Phase 2: Bonding Conductor Sizing

```javascript
/**
 * CSA Rule 4-022: Bonding conductor sizing per circuit ampacity
 * Currently a placeholder; future implementation will reference Rule 4-022 tables
 */
function calculateBondingSize(circuitAmpacity, conductorMaterial) {
  // Rule 4-022 table: circuit ampacity in column 1 → bonding size in column 2
  // Implement after core ampacity/voltage drop are solid
  return "TBD per Rule 4-022";
}
```

### Phase 3: Equipment Grounding Conductor

```javascript
/**
 * CSA Rule 4-024: Grounding conductor sizing
 * Similar to Rule 4-022 table; future enhancement
 */
function calculateGroundingSize(circuitAmpacity, conductorMaterial) {
  return "TBD per Rule 4-024";
}
```

### Phase 4: Parallel Conductors (Rule 4-029)

```javascript
/**
 * If parallel_sets > 1, special rules apply:
 * - Each set must be same size and material
 * - Each set uses a separate grouping deduction (Table 5C)
 * - Total ampacity = single-set ampacity × number of sets × grouping deduction
 */
function calculateParallelAmpacity(singleSetAmpacity, numParallelSets, conductorsPerSet) {
  const groupingDeduction = getGroupingDeduction(conductorsPerSet);
  return singleSetAmpacity * numParallelSets * groupingDeduction;
}
```

### Phase 5: Voltage Drop Optimization

```javascript
/**
 * Interactive tool: given load current and max voltage drop,
 * suggest minimum conductor size (for cost optimization)
 */
function suggestOptimalSize(circuitData) {
  // Iterative search through conductor sizes
  // Return size that meets BOTH ampacity and voltage drop with smallest cross-section
  return "6 AWG";
}
```

### Phase 6: Multi-Circuit Management

```javascript
/**
 * Support multiple circuits in same conduit/cable bundle
 * Affects grouping deduction (Table 5C) and thermal derating
 */
const multiCircuitForm = {
  circuits: [
    { id: "ckt1", current_a: 100, insulation_rating_c: 90 },
    { id: "ckt2", current_a: 75, insulation_rating_c: 90 },
    { id: "ckt3", current_a: 50, insulation_rating_c: 90 }
  ],
  grouping_deduction: 0.70  // From Table 5C
};
```

### Phase 7: Direct Burial Specifics

```javascript
/**
 * For "direct burial" cable type:
 * - Must use Table D3 "Cable" column (not raceway)
 * - Consider soil resistivity for thermal derating
 * - May require deeper burial in high-temp regions
 */
function getDirectBurialVoltageDropK(conductorSize, pf, soilResistivity) {
  // Placeholder; may require lookup table
  return 0.101;
}
```

### Phase 8: Export Options

- **CSV**: Form inputs + results in structured rows
- **JSON**: Full calculation object for archiving/version control
- **Calculation Notes**: Inline markdown explaining formula and table lookups
- **CSA Code References**: Inline Rule/Table citations for compliance documentation

---

## 10. Final Recommended Structure

### File Organization (Proposed)

```
cable-sizing-app/
├── index.html                    # Main page; form structure
├── css/
│   ├── styles.css               # All styling (dark theme, form, results)
│   └── print.css                # PDF/print-specific styles
├── js/
│   ├── app.js                   # Main controller; form state & calculation
│   ├── csa_tables.js            # CSA Table 1–5A, D3 data (large file)
│   ├── validator.js             # Validation rules (optional; can be in app.js)
│   ├── pdf_export.js            # PDF generation (uses jsPDF or similar)
│   └── util.js                  # Helper functions (unit conversion, etc.)
├── data/
│   └── csa_tables.json          # CSA tables in JSON (alternative to csa_tables.js)
└── README.md                    # Documentation
```

### Minimal HTML Structure Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSA C22.1:24 Cable Sizing Calculator</title>
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/print.css" media="print">
</head>
<body class="dark-theme">
  <header>
    <h1>Cable Sizing Calculator</h1>
    <p>CSA C22.1:24 Edition</p>
  </header>

  <main>
    <form id="cable-form" class="two-column-layout">
      
      <!-- LEFT COLUMN: CIRCUIT INFO -->
      <section class="form-column-left">
        <fieldset id="circuit-info">
          <legend>Circuit Information</legend>
          <!-- Inputs here -->
        </fieldset>

        <fieldset id="electrical-system">
          <legend>Electrical System</legend>
          <!-- Inputs here -->
        </fieldset>
      </section>

      <!-- RIGHT COLUMN: INSTALLATION TYPE -->
      <section class="form-column-right">
        <fieldset id="installation-category">
          <legend>Installation Category</legend>
          <p class="fieldset-help">Determines which CSA table is used.</p>
          <!-- Radio buttons here -->
        </fieldset>
      </section>

      <!-- MIDDLE SECTION: CONDUCTORS & INSTALLATION -->
      <section class="form-full-width">
        <fieldset id="conductors">
          <legend>Conductors & Installation</legend>
          <!-- Inputs here; visibility controlled by JS -->
        </fieldset>

        <fieldset id="code-basis">
          <legend>Code Basis</legend>
          <!-- Read-only reference & notes -->
        </fieldset>
      </section>

      <!-- BUTTONS -->
      <section class="form-actions">
        <button type="button" id="btn-calculate" class="btn-primary">
          Calculate
        </button>
        <button type="button" id="btn-export-pdf" class="btn-secondary">
          Export to PDF
        </button>
        <button type="reset" class="btn-tertiary">
          Clear Form
        </button>
      </section>
    </form>

    <!-- RESULTS PANEL -->
    <section id="results-panel" class="hidden">
      <fieldset id="results">
        <legend>Results</legend>
        <div id="results-content">
          <!-- Populated by JS after calculation -->
        </div>
      </fieldset>
    </section>
  </main>

  <script src="js/csa_tables.js"></script>
  <script src="js/util.js"></script>
  <script src="js/validator.js"></script>
  <script src="js/pdf_export.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

### CSS Structure Example (Dark Theme)

```css
/* variables.css - or inline in styles.css */
:root {
  --color-bg-primary: #1e1e1e;
  --color-bg-secondary: #2d2d2d;
  --color-text-primary: #e0e0e0;
  --color-text-secondary: #a0a0a0;
  --color-border: #404040;
  --color-input-bg: #252525;
  --color-accent: #0066cc;
  --color-error: #ff6b6b;
  --color-warning: #ffcc00;
  --color-success: #4caf50;
  --spacing-unit: 8px;
}

body.dark-theme {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.form-column-left,
.form-column-right {
  flex: 1;
  min-width: 300px;
  margin: var(--spacing-unit);
}

fieldset {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: var(--spacing-unit) * 2;
  margin: var(--spacing-unit) 0;
  background: var(--color-bg-secondary);
}

label {
  display: block;
  margin-bottom: var(--spacing-unit);
  color: var(--color-text-primary);
}

input[type="text"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: var(--spacing-unit);
  background: var(--color-input-bg);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.fieldset-help {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-unit) * 2;
}

.hidden {
  display: none;
}

.btn-primary {
  background: var(--color-accent);
  color: white;
}

.btn-primary:hover {
  background: #0051a8;
}

@media print {
  body { background: white; color: black; }
  .btn-primary, .btn-secondary, .btn-tertiary { display: none; }
}
```

---

## 11. PDF Export Implementation

### Overview

The PDF export generates a comprehensive calculation report that includes:
1. **Form Inputs**: All user selections (for audit trail)
2. **Calculation Steps**: Each step with CSA table references
3. **Results Summary**: Recommended size, ampacity, voltage drop
4. **Code References**: Rule and table citations for compliance
5. **Methodology Notes**: Explanation of derating, corrections, grouping, etc.

### Example PDF Structure

```
┌────────────────────────────────────────────────┐
│   CABLE SIZING CALCULATION REPORT              │
│   CSA C22.1:24 Edition                         │
│   Date: 2025-04-19                             │
│   Project: [Optional]                          │
└────────────────────────────────────────────────┘

SECTION 1: INPUT SUMMARY
─────────────────────────

Circuit Information:
  • Circuit Type: 3-Phase AC
  • Source Voltage: 600 V
  • Load Current: 200 A
  • Run Length: 300 m
  • Max Voltage Drop: 3%

Electrical System:
  • Ambient Temperature: 35°C
  • Power Factor: 0.9
  • Load Type: Inductive

Installation:
  • Category: Cable Assembly
  • Cable Type: TECK
  • Conductor Material: Copper
  • Number of Conductors: 3
  • Insulation Rating: 90°C

────────────────────────────────────────────────

SECTION 2: CALCULATION STEPS
─────────────────────────────

Step 1: Determine CSA Table
  Input: Installation Type = Cable; Conductor = Copper
  Output: Use Table 2 (Ampacities for not more than three insulated copper conductors in raceway or cable)
  CSA Ref: Rule 4-006, Table 2

Step 2: Temperature Correction Factor
  Ambient Temperature: 35°C
  Insulation Rating: 90°C
  Correction Factor (Table 5A): 0.96
  CSA Ref: Table 5A

Step 3: Base Ampacity (Table 2, 90°C Column)
  Conductor Size: 4 AWG
  Base Ampacity: 95 A
  CSA Ref: Table 2

Step 4: Apply Temperature Correction
  Adjusted Ampacity = 95 A × 0.96 = 91.2 A ✓ (Available)
  Required Load: 200 A
  Status: FAIL – 91.2 A < 200 A
  
  Next Size: 2 AWG
  Base Ampacity: 190 A
  Adjusted Ampacity = 190 A × 0.96 = 182.4 A ✓ (Available)
  Status: FAIL – 182.4 A < 200 A
  
  Next Size: 1/0 AWG
  Base Ampacity: 260 A
  Adjusted Ampacity = 260 A × 0.96 = 249.6 A ✓ (Available)
  Status: PASS – 249.6 A ≥ 200 A ✓

Step 5: Voltage Drop Calculation
  Formula: VD = (I × K × L) / 1000
  
  Where:
    I = Load Current = 200 A
    K = Voltage Drop Factor (Table D3, 90% PF, Cable, Copper, 1/0 AWG) = 0.41 Ω/km
    L = Run Length = 300 m = 0.3 km
  
  VD = (200 × 0.41 × 0.3) / 1000 = 0.0246 V = 24.6 mV
  
  VD% = (24.6 / 600) × 100 = 4.1%
  
  Max Allowed: 3%
  Status: FAIL – 4.1% > 3%
  
  Next Size: 2/0 AWG
  K Value (Table D3): 0.331 Ω/km
  VD = (200 × 0.331 × 0.3) / 1000 = 0.0198 V = 19.8 mV
  VD% = (19.8 / 600) × 100 = 3.3%
  
  Status: FAIL – 3.3% > 3%
  
  Next Size: 3/0 AWG
  K Value (Table D3): 0.267 Ω/km
  VD = (200 × 0.267 × 0.3) / 1000 = 0.0160 V = 16.0 mV
  VD% = (16.0 / 600) × 100 = 2.7%
  
  Status: PASS – 2.7% ≤ 3% ✓

Step 6: Final Size Selection
  Both ampacity and voltage drop constraints are satisfied.
  
  Recommended Conductor Size: 3/0 AWG Copper
  CSA Ref: Table 2 (3/0 row, 90°C column), Table D3 (3/0 row, Cable, 90% Pf)

────────────────────────────────────────────────

SECTION 3: RESULTS SUMMARY
──────────────────────────

Recommended Conductor Size:       3/0 AWG Copper
Available Ampacity:               310 A (base) → 297.6 A (after 0.96 correction)
Load Current:                      200 A ✓ (97.6 A margin)
Voltage Drop:                      16.0 mV (2.7%) ✓ (0.3% margin)

Installation:                      TECK 3-Conductor Cable, 3/0 AWG Cu, 90°C
CSA Standard:                      C22.1:24
Ambient Temperature:              35°C (requires 0.96 derating from Table 5A)

Special Notes:
  None

────────────────────────────────────────────────

SECTION 4: COMPLIANCE & REFERENCES
───────────────────────────────────

Standards Cited:
  • CSA C22.1:24 Canadian Electrical Code, Part I (2024)

Rules Referenced:
  • Rule 4-004: Application of ampacity tables
  • Rule 4-006: Installations affecting ampacity
  • Rule 4-008: Voltage drop limits
  • Rule 4-029: Parallel conductors
  
Tables Referenced:
  • Table 2: Ampacities for insulated copper conductors in cable/raceway
  • Table 5A: Temperature correction factors
  • Table D3: K values for voltage drop calculation

Assumptions:
  • Ambient temperature is steady-state (30°C or stated value)
  • Load is continuous (≥3 hours)
  • Conductors are rated for 90°C
  • Cable routing allows for passive cooling
  • No special environmental derating (wet, corrosive, etc.)

────────────────────────────────────────────────

SECTION 5: CALCULATION METHODOLOGY NOTES
─────────────────────────────────────────

Why 90°C Insulation Rating?
  Selected by user. Higher ratings (90°C vs. 75°C) allow higher ampacity.
  Common in commercial/industrial applications for margin.

Why Temperature Derating (0.96)?
  Ambient temp 35°C (5°C above CSA base of 30°C) reduces ampacity per Table 5A.
  As ambient increases, conductor resistance increases, reducing current capacity.

Why Multi-Size Iteration?
  Ampacity and voltage drop are competing constraints.
  A size might pass ampacity but fail voltage drop (or vice versa).
  Iteration finds the minimum size satisfying both.

Voltage Drop Calculation (Table D3):
  K value includes resistance and reactance (impedance) of the conductor.
  Formula: VD (V) = I × K × L / 1000
  For AC 3-phase at 90% PF, K includes reactive component.
  For different power factors, Table D3 provides separate columns.

────────────────────────────────────────────────

Prepared by: [User Name / Software Version]
Date: April 19, 2025
Project: [Optional]
Notes: [Optional user-added notes]
```

### PDF Export Code (Skeleton)

```javascript
/**
 * Generate PDF report from calculation results
 * Uses jsPDF library (external dependency)
 */
function generatePdfReport(formData, calculationResults) {
  // Import jsPDF (assumed to be loaded globally)
  const { jsPDF } = window;

  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;
  const lineHeight = 7;
  const margin = 15;

  // Title
  doc.setFontSize(16);
  doc.text("CABLE SIZING CALCULATION REPORT", pageWidth / 2, yPos, { align: "center" });
  yPos += lineHeight * 2;

  doc.setFontSize(10);
  doc.text(`CSA C22.1:24 Edition | Date: ${new Date().toLocaleDateString()}`, 
    pageWidth / 2, yPos, { align: "center" });
  yPos += lineHeight * 2;

  // Section 1: Input Summary
  doc.setFontSize(12);
  doc.text("SECTION 1: INPUT SUMMARY", margin, yPos);
  yPos += lineHeight * 1.5;

  doc.setFontSize(10);
  const inputData = [
    ["Circuit Type:", formData.circuit.type],
    ["Source Voltage:", `${formData.circuit.voltage_v} V`],
    ["Load Current:", `${formData.circuit.current_a} A`],
    ["Run Length:", `${formData.circuit.run_length_m} m`],
    ["Max Voltage Drop:", `${formData.circuit.max_voltage_drop_pct}%`],
    ["Installation Type:", formData.installation.type],
    ["Conductor Material:", formData.conductors.material],
    ["Insulation Rating:", `${formData.conductors.insulation_rating_c}°C`],
    ["Ambient Temperature:", `${formData.system.ambient_temp_c}°C`]
  ];

  inputData.forEach(([label, value]) => {
    doc.text(`${label} ${value}`, margin, yPos);
    yPos += lineHeight;
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = margin;
    }
  });

  yPos += lineHeight;

  // Section 2: Calculation Steps (simplified)
  doc.setFontSize(12);
  doc.text("SECTION 2: CALCULATION STEPS", margin, yPos);
  yPos += lineHeight * 1.5;

  doc.setFontSize(9);
  const steps = [
    `Step 1: CSA Table Determination: ${calculationResults.csa_table_ref}`,
    `Step 2: Temperature Correction Factor: ${calculationResults.correction_factor.toFixed(3)}`,
    `Step 3: Base Ampacity: [Size lookup from ${calculationResults.csa_table_ref}]`,
    `Step 4: Adjusted Ampacity: ${calculationResults.ampacity_available_a.toFixed(1)} A`,
    `Step 5: Voltage Drop: ${calculationResults.voltage_drop_v.toFixed(2)} V (${calculationResults.voltage_drop_pct.toFixed(2)}%)`
  ];

  steps.forEach(step => {
    doc.text(step, margin, yPos);
    yPos += lineHeight;
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = margin;
    }
  });

  yPos += lineHeight;

  // Section 3: Results Summary
  doc.setFontSize(12);
  doc.text("SECTION 3: RESULTS SUMMARY", margin, yPos);
  yPos += lineHeight * 1.5;

  doc.setFontSize(10);
  doc.text(`Recommended Size: ${calculationResults.recommended_size_awg}`, margin, yPos);
  yPos += lineHeight;
  doc.text(`Available Ampacity: ${calculationResults.ampacity_available_a.toFixed(1)} A`, margin, yPos);
  yPos += lineHeight;
  doc.text(`Voltage Drop: ${calculationResults.voltage_drop_pct.toFixed(2)}%`, margin, yPos);
  yPos += lineHeight;

  // Footer
  doc.setFontSize(8);
  doc.text(
    `Generated by Cable Sizing Calculator | CSA C22.1:24`,
    margin,
    pageHeight - 10
  );

  return doc;
}

/**
 * Download PDF to user's computer
 */
function downloadPdf(formData, calculationResults) {
  const doc = generatePdfReport(formData, calculationResults);
  const filename = `cable-sizing-${new Date().getTime()}.pdf`;
  doc.save(filename);
}

// Attach to button click
document.getElementById("btn-export-pdf").addEventListener("click", () => {
  const controller = new CableSelectionController();
  downloadPdf(controller.form, controller.results);
});
```

---

## Summary: Key Takeaways

### Do's
- ✅ Use radio buttons or prominent dropdown for **Installation Category** (it's the primary control)
- ✅ Group fields by purpose (Circuit, System, Installation, Conductors, Results)
- ✅ Show/hide fields conditionally based on installation type
- ✅ Display helper text inline or immediately below field labels
- ✅ Map user selections to CSA tables accurately (cable→Table 2, free air→Table 1, etc.)
- ✅ Apply Table 5A correction factors automatically
- ✅ Export PDF with full methodology and citations

### Don'ts
- ❌ Don't merge cable and raceway into a single "Cable & Raceway" category
- ❌ Don't hide the installation type selector (it's too important)
- ❌ Don't use NEC terminology or table references (CSA only)
- ❌ Don't assume users understand "free air" without explanation
- ❌ Don't skip voltage drop calculation (it often governs size selection)
- ❌ Don't forget temperature derating (Table 5A; easily missed by novices)

### Alternative Labels (Choose One)
1. **Installation Category** (Recommended) – Clear, CSA-aligned
2. **Installation Method** – More technical, implies methodology
3. **Conductor Installation Type** – Precise but verbose

### Recommended Default
- `cable` (most common; TECK/ACWU for typical construction projects)

### Testing Checklist
- [ ] Form validates all required fields
- [ ] Installation type change hides/shows correct fields
- [ ] Ampacity lookup matches CSA Table 1–4 exactly
- [ ] Temperature correction from Table 5A applies correctly
- [ ] Voltage drop K value matches Table D3
- [ ] Voltage drop calculation matches formula: VD = I×K×L/1000
- [ ] PDF export includes all inputs, steps, and references
- [ ] Dark theme CSS is readable and professional

