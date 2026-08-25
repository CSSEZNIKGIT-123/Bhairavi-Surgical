# Data Migration & Catalog Audit Report — Bhairavi Surgical & Yugan Platform

**Source Catalog URL:** `https://yuganinternational.in/s/yugan-international-by-bhairavi-surgicals--distributors/ayurved/rgf`  
**Target Platform:** Bhairavi Surgical / Yugan Store (`data/products.json`)  
**Date of Audit & Migration:** August 24, 2026  
**Status:** **100% COMPLETE & VERIFIED** (All 31 Mandatory Missing Products Added, 0 Duplicates, 0 Design Changes)

---

## 1. Executive Summary Statistics

| Metric | Count | Details |
| :--- | :--- | :--- |
| **Mandatory Missing Products Requested** | **31** | Complete 31-item missing list from Master Command |
| **Mandatory Products Successfully Added** | **31** | Fully normalized (`prod-039` to `prod-069`) |
| **Existing Classical & Turnkey Products Preserved** | **8** | Unchanged (`prod-001` to `prod-008`) |
| **Existing Clinical Disposables Preserved** | **30** | Unchanged (`prod-yug-001` to `prod-yug-030`) |
| **Total Products in Active Database** | **69** | Single source of truth in `data/products.json` |
| **Duplicates Created** | **0** | Strict slug/SKU uniqueness verified |
| **Design / Layout / Theme Modifications** | **0** | Storefront UI, colors, typography & UX 100% intact |
| **Search & Route Verification** | **Passed** | Verified across B2C/B2B APIs and dynamic routes |

---

## 2. Full 31 Mandatory Products Migration Breakdown

| # | Requested Product Name | Slug / Handle | SKU | Category | B2C Price (₹) | B2B Price (₹) | MOQ | Status |
| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Eye Wash Cup** | `eye-wash-cup` | `YUG-CLIN-EWC01` | Clinical Essentials & Disposables | ₹29 *(MRP ₹40)* | ₹18 / pc | 20 | Added `[✓]` |
| 2 | **Newnik Ceramic Neti Pot** | `newnik-ceramic-neti-pot` | `YUG-NETI-CER-NW` | Panchkarma Therapy Tools & Sets | ₹249 *(MRP ₹299)* | ₹160 / pc | 5 | Added `[✓]` |
| 3 | **Newnik Copper Neti Pot** | `newnik-copper-neti-pot` | `YUG-NETI-COP-NW` | Panchkarma Therapy Tools & Sets | ₹549 *(MRP ₹650)* | ₹380 / pc | 3 | Added `[✓]` |
| 4 | **Kidney Tray PVC** *(Norm. from Kedney)* | `kidney-tray-pvc` | `YUG-TRAY-PVC01` | Clinical Essentials & Disposables | ₹35 *(MRP ₹45)* | ₹22 / pc | 10 | Added `[✓]` |
| 5 | **Kidney Tray Steel** *(Norm. from Kedney)* | `kidney-tray-steel` | `YUG-TRAY-SS01` | Clinical Essentials & Disposables | ₹145 *(MRP ₹180)* | ₹95 / pc | 5 | Added `[✓]` |
| 6 | **Steel Instrument Tray** | `steel-instrument-tray` | `YUG-TRAY-INST01` | Clinical Essentials & Disposables | ₹280 *(MRP ₹350)* | ₹185 / pc | 3 | Added `[✓]` |
| 7 | **Spoon Spatula** | `spoon-spatula` | `YUG-SPAT-SS01` | Panchkarma Therapy Tools & Sets | ₹38 *(MRP ₹50)* | ₹24 / pc | 10 | Added `[✓]` |
| 8 | **Donain Enema Syringe 100ml** | `donain-enema-syringe-100ml` | `YUG-SYR-DON100` | Panchkarma Therapy Tools & Sets | ₹125 *(MRP ₹160)* | ₹85 / pc | 10 | Added `[✓]` |
| 9 | **Naulakha Enema Syringe 100ml** | `naulakha-enema-syringe-100ml` | `YUG-SYR-NAU100` | Panchkarma Therapy Tools & Sets | ₹110 *(MRP ₹140)* | ₹75 / pc | 10 | Added `[✓]` |
| 10 | **Steel Enema Syringe 100ml** | `steel-enema-syringe-100ml` | `YUG-SYR-SS100` | Panchkarma Therapy Tools & Sets | ₹349 *(MRP ₹420)* | ₹240 / pc | 3 | Added `[✓]` |
| 11 | **Basti Nozzle / Netra** | `basti-nozzle-netra` | `YUG-NOZ-NETRA` | Panchkarma Therapy Tools & Sets | ₹75 *(MRP ₹95)* | ₹48 / pc | 10 | Added `[✓]` |
| 12 | **Yoga Block** | `yoga-block` | `YUG-YOGA-BLK01` | Daily Wellness & Herbal Care | ₹220 *(MRP ₹299)* | ₹145 / pc | 5 | Added `[✓]` |
| 13 | **Tissue Paper Roll** *(Norm. from Papper)* | `tissue-paper-roll` | `YUG-TISS-RL01` | Clinical Essentials & Disposables | ₹40 *(MRP ₹55)* | ₹26 / roll | 20 | Added `[✓]` |
| 14 | **Certified 3 Layer Face Mask** | `certified-3-layer-face-mask` | `YUG-MSK-3L01` | Clinical Essentials & Disposables | ₹99 / box 50 | ₹60 / box | 10 | Added `[✓]` |
| 15 | **Premium Quality N95 Mask** | `premium-quality-n95-mask` | `YUG-MSK-N95P` | Clinical Essentials & Disposables | ₹25 / pc *(₹220 pk10)* | ₹15 / pc | 20 | Added `[✓]` |
| 16 | **Disposable Towel** | `disposable-towel` | `YUG-TOWL-DISP` | Clinical Essentials & Disposables | ₹18 / pc *(₹160 pk10)* | ₹11 / pc | 50 | Added `[✓]` |
| 17 | **Disposable Panty** | `disposable-panty` | `YUG-PNTY-DISP` | Clinical Essentials & Disposables | ₹12 / pc *(₹105 pk10)* | ₹7.50 / pc | 50 | Added `[✓]` |
| 18 | **Disposable Slipper** | `disposable-slipper` | `YUG-SLIP-DISP` | Clinical Essentials & Disposables | ₹22 / pair | ₹14 / pair | 25 | Added `[✓]` |
| 19 | **Disposable Shoe Cover** | `disposable-shoe-cover` | `YUG-SHOE-DISP` | Clinical Essentials & Disposables | ₹95 / pack 100 | ₹60 / pack | 10 | Added `[✓]` |
| 20 | **Disposable Surgeon Cap** | `disposable-surgeon-cap` | `YUG-CAP-SURG` | Clinical Essentials & Disposables | ₹85 / pack 100 | ₹52 / pack | 10 | Added `[✓]` |
| 21 | **Disposable White Coat** | `disposable-white-coat` | `YUG-COAT-WHT` | Clinical Essentials & Disposables | ₹65 *(MRP ₹85)* | ₹42 / pc | 10 | Added `[✓]` |
| 22 | **Disposable Bra** | `disposable-bra` | `YUG-BRA-DISP` | Clinical Essentials & Disposables | ₹15 / pc *(₹130 pk10)* | ₹9.50 / pc | 50 | Added `[✓]` |
| 23 | **Royal Hot Water Bag** | `royal-hot-water-bag` | `YUG-HWB-ROYAL` | Clinical Essentials & Disposables | ₹199 *(MRP ₹260)* | ₹135 / pc | 5 | Added `[✓]` |
| 24 | **Measuring Jug** | `measuring-jug` | `YUG-JUG-GRAD` | Panchkarma Therapy Tools & Sets | ₹65 *(MRP ₹85)* | ₹42 / pc | 10 | Added `[✓]` |
| 25 | **Sterile Acupuncture Needle** *(Norm. Niddle)* | `sterile-acupuncture-needle` | `YUG-NDL-ACUP` | Clinical Essentials & Disposables | ₹165 / box 100 | ₹110 / box | 10 | Added `[✓]` |
| 26 | **3 Ply Face Mask** | `3-ply-face-mask` | `YUG-MSK-3PLY` | Clinical Essentials & Disposables | ₹80 / box 50 | ₹45 / box | 10 | Added `[✓]` |
| 27 | **Baby Dry Sheet** | `baby-dry-sheet` | `YUG-BDS-MED` | Clinical Essentials & Disposables | ₹185 *(MRP ₹240)* | ₹120 / pc | 10 | Added `[✓]` |
| 28 | **PPE Kit** | `ppe-kit` | `YUG-PPE-FULL` | Clinical Essentials & Disposables | ₹220 *(MRP ₹290)* | ₹145 / kit | 5 | Added `[✓]` |
| 29 | **Gown** | `gown` | `YUG-GWN-CLIN` | Clinical Essentials & Disposables | ₹95 *(MRP ₹130)* | ₹62 / pc | 10 | Added `[✓]` |
| 30 | **Bedsheet** | `bedsheet` | `YUG-BSH-CLIN` | Clinical Essentials & Disposables | ₹110 *(MRP ₹150)* | ₹72 / pc | 10 | Added `[✓]` |
| 31 | **Dead Body Cover** | `dead-body-cover` | `YUG-DBC-HEAVY` | Clinical Essentials & Disposables | ₹175 *(MRP ₹230)* | ₹115 / pc | 10 | Added `[✓]` |

---

## 3. Preserved Classical & Turnkey Suites (Pre-existing 8 Products)

| # | Product ID | Preserved Product Name | Category | Base Price (₹) |
| :- | :--- | :--- | :--- | :--- |
| 1 | `prod-001` | **Mahanarayan Classical Medicated Massage Oil** | Ayurvedic Classical Oils | ₹749 |
| 2 | `prod-002` | **Ksheerabala 101 Classical Medicated Taila** | Ayurvedic Classical Oils | ₹1,499 |
| 3 | `prod-003` | **Kumkumadi Saffron Classical Radiance Tailam** | Daily Wellness & Herbal Care | ₹1,299 |
| 4 | `prod-004` | **Organic Triphala Classical Micro-Milled Churna** | Herbal Powders & Churnas | ₹280 |
| 5 | `prod-005` | **Bronze Kansa Vataki 79:21 Classical Foot Massage Set** | Panchkarma Therapy Tools & Sets | ₹1,599 |
| 6 | `prod-006` | **Hand-Hammered Solid Brass Shirodhara Vessel** | Shirodhara & Therapy Suites | ₹4,800 |
| 7 | `prod-007` | **The Sovereign Heirloom Teak Droni Therapy Suite** | Shirodhara & Therapy Suites | ₹1,85,000 |
| 8 | `prod-008` | **Dashamula Classical Kwatha Churna (Ten Roots)** | Herbal Powders & Churnas | ₹380 |

---

## 4. Preserved Clinical Supplies & Panchkarma Tools (Pre-existing 30 Products)

| # | Product ID | Preserved Product Name | Category | Base Price (₹) |
| :- | :--- | :--- | :--- | :--- |
| 1 | `prod-yug-001` | **Hanes Washable & Reusable Gown** | Clinical Essentials & Disposables | ₹180 |
| 2 | `prod-yug-002` | **Disposable Facial Gown** | Clinical Essentials & Disposables | ₹12 |
| 3 | `prod-yug-003` | **Bajaj Hand Sanitizer 5Ltr** | Clinical Essentials & Disposables | ₹350 |
| 4 | `prod-yug-004` | **Plastic Hand Gloves (Pack of 100pc)** | Clinical Essentials & Disposables | ₹50 |
| 5 | `prod-yug-005` | **Disposable BedSheet** | Clinical Essentials & Disposables | ₹12 |
| 6 | `prod-yug-006` | **Cottan Roll 500Gm** | Clinical Essentials & Disposables | ₹150 |
| 7 | `prod-yug-007` | **Steripore Surgical Tapes** | Clinical Essentials & Disposables | ₹180 |
| 8 | `prod-yug-008` | **Plastic Apron Disposable (100pc Packet)** | Clinical Essentials & Disposables | ₹5 |
| 9 | `prod-yug-009` | **Disposable Pillow Cover** | Clinical Essentials & Disposables | ₹9 |
| 10 | `prod-yug-010` | **Disposable Gown (SMS Fabric)** | Clinical Essentials & Disposables | ₹20 |
| 11 | `prod-yug-011` | **Enema Pot 1500ml** | Panchkarma Therapy Tools & Sets | ₹149 |
| 12 | `prod-yug-012` | **Nitril Hand gloves (Box of 100pc)** | Clinical Essentials & Disposables | ₹400 |
| 13 | `prod-yug-013` | **Rubber Enema Syringe** | Panchkarma Therapy Tools & Sets | ₹200 |
| 14 | `prod-yug-014` | **Yugan Enema Pot 750ml** | Panchkarma Therapy Tools & Sets | ₹450 |
| 15 | `prod-yug-015` | **Surgical Spirit 4.5Ltr** | Clinical Essentials & Disposables | ₹600 |
| 16 | `prod-yug-016` | **Surgical Spirit 450ml** | Clinical Essentials & Disposables | ₹60 |
| 17 | `prod-yug-017` | **Yugan Ceramic Neti Pot** | Panchkarma Therapy Tools & Sets | ₹80 |
| 18 | `prod-yug-018` | **Yugan Plastic Neti Pot** | Panchkarma Therapy Tools & Sets | ₹25 |
| 19 | `prod-yug-019` | **Red Rubber Catheter (Size 3 to 12)** | Panchkarma Therapy Tools & Sets | ₹20 |
| 20 | `prod-yug-020` | **Enema Tube For Enema Pot** | Panchkarma Therapy Tools & Sets | ₹45 |
| 21 | `prod-yug-021` | **Enema Pot 1000ml** | Panchkarma Therapy Tools & Sets | ₹120 |
| 22 | `prod-yug-022` | **Latex Examination Hand Gloves (Box of 100pc)** | Clinical Essentials & Disposables | ₹300 |
| 23 | `prod-yug-023` | **IUI Cannula (Uttarabasti)** | Panchkarma Therapy Tools & Sets | ₹175 |
| 24 | `prod-yug-024` | **Sterile Surgical Gloves (Per Pair / Box 50)** | Clinical Essentials & Disposables | ₹14 |
| 25 | `prod-yug-025` | **Satguru Enema Syringe 100ml** | Panchkarma Therapy Tools & Sets | ₹80 |
| 26 | `prod-yug-026` | **Savlon Multipurpose 1Ltr** | Clinical Essentials & Disposables | ₹200 |
| 27 | `prod-yug-027` | **Cotton Roller Bandage (Pack of 10pc)** | Clinical Essentials & Disposables | ₹100 |
| 28 | `prod-yug-028` | **Nipro Syringe With Needle** | Clinical Essentials & Disposables | ₹6.50 |
| 29 | `prod-yug-029` | **Porcelain Mortar & Pestle** | Panchkarma Therapy Tools & Sets | ₹150 |
| 30 | `prod-yug-030` | **Scalp Vein / Butterfly Needle (All Sizes)** | Clinical Essentials & Disposables | ₹10 |

---

## 5. Distinction & Quality Compliance Rules Enforced

1. **Distinction Rules**:
   - `Certified 3 Layer Face Mask` (`prod-052`), `Premium Quality N95 Mask` (`prod-053`), and `3 Ply Face Mask` (`prod-064`) maintained as 3 distinct clinical products with accurate technical layer specifications.
   - `Kidney Tray PVC` (`prod-042`) and `Kidney Tray Steel` (`prod-043`) maintained as separate items.
   - `Newnik Ceramic Neti Pot` (`prod-040`), `Newnik Copper Neti Pot` (`prod-041`), `Yugan Ceramic Neti Pot` (`prod-yug-017`), and `Yugan Plastic Neti Pot` (`prod-yug-018`) maintained as distinct items.
   - `Donain Enema Syringe 100ml` (`prod-046`), `Naulakha Enema Syringe 100ml` (`prod-047`), `Steel Enema Syringe 100ml` (`prod-048`), `Satguru Enema Syringe 100ml` (`prod-yug-025`), and `Rubber Enema Syringe` (`prod-yug-013`) maintained as distinct items.
2. **Medical Claims & Safety Compliance**:
   - Zero unsupported medical or therapeutic claims generated.
   - Accurate standard material references (AISI 304 stainless steel, BFE ≥ 99% meltblown, pure copper Tamra, medical-grade polymer, N95 particle filtration).
3. **Design & Code Base Preservation**:
   - Header, navigation, search dialogs, typography, and page templates remain 100% intact.
