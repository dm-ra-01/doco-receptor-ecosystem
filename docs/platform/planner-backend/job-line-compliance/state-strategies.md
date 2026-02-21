The short answer is that while every state and territory is governed by the same overarching Australian Medical Council (AMC) National Framework, your algorithm **must be parameterized to handle state-specific and hospital-specific structural deviations**.

The AMC sets the national baseline (the "floor"), but the state-based Postgraduate Medical Councils (PMCs) interpret, accredit, and enforce these rules, often adding their own specific structural constraints.

Here is a comprehensive breakdown of the national baseline and how states deviate from it.

### The Baseline: AMC National Framework (Implemented 2024-2025)

The new framework shifts away from mandatory specific terms (like 10 weeks of surgery) and focuses on broad patient care categories and exposure caps.

**PGY1 (Intern) AMC Requirements:**

* **Total Time:** Minimum 47 weeks FTE.


* **Structure:** Minimum of 4 discrete terms, each at least 10 weeks long.


* **Clinical Experience:** Must include exposure to all four categories: A (Undifferentiated), B (Chronic), C (Acute/Critical), and D (Peri-procedural).
* **Caps:** Maximum 50% of the year in any parent specialty, and maximum 25% in any single subspecialty.
* **Service Terms:** Maximum 20% of the year spent in service terms (e.g., relief, nights).


* **Team Embedding:** At least 50% of the year must be embedded within a continuous clinical team.



**PGY2 AMC Requirements:**

* **Total Time:** Minimum 47 weeks FTE.


* **Structure:** Minimum of 3 discrete terms, each at least 10 weeks long.


* **Clinical Experience:** Must include exposure to categories A, B, and C (Category D is optional for PGY2s).


* **Caps:** Maximum 25% of the year in any single subspecialty. One term is permitted in a non-clinical specialty (e.g., pathology, public health).


* **Service Terms:** Maximum 25% of the year spent in service terms.


* **Team Embedding:** At least 50% of the year embedded in a clinical team.



### State-Level Deviations & Interpretations

Your OR-Tools algorithm will need configurable constraints for the following state-level differences:

**1. Victoria (PMCV)**

* **Structure:** PMCV generally mandates a 5-term clinical year for PGY1s to meet the 47-week minimum alongside annual leave.


* **6-Month Exemptions:** While AMC dictates a max of 25% per subspecialty, Victoria has historically relied on 6-month terms for PGY2s. PMCV allows this only if the algorithm satisfies four strict boolean conditions: the specialty has two subspecialty components, it is tied to a diploma/certificate, the vocational college requires a 6-month placement, and the doctor still achieves A, B, and C exposures in their remaining terms.



**2. New South Wales (HETI)**

* **Structure:** HETI explicitly requires PGY1 and PGY2 job lines to be structured as **five terms** across the clinical year. Your algorithm cannot simply output a 4-term year in NSW, even though the AMC allows it.
* **Service terms:** HETI stipulates that interns can only work in exactly "one service term during the year".

**3. Northern Territory (PMCNT/PMAS)**

* **Hospital-Specific Structures:** The NT highlights why your algorithm needs hospital-level parameters, not just state-level. The Top End Regional Health Service runs on a 5-term internship year, whereas the Central Australia Regional Health Service runs on a 4-term internship year.

**4. Queensland (PMAQ)**

* **Rural Pathways:** Queensland has a highly developed Rural Generalist Pathway. If a doctor is on this track, your algorithm will need to ingest entirely different constraints, such as ensuring 12-month hospital terms or specific community-based General Practice terms.
* **Category Accreditation:** PMAQ emphasizes that individual terms are pre-accredited for a maximum of two clinical categories. This mapping is strictly determined locally, meaning the same type of ward might be a "Category A" in one hospital but a "Category C" in another.

**5. South Australia (SA MET), Western Australia (PMCWA), and Tasmania (PMCT)**

* **Flexibility:** These states generally adhere to the AMC baseline but allow Local Health Networks (LHNs) to choose whether they want to configure their rosters into 4-term or 5-term clinical years.

### Implications for your Algorithm

To be viable across Australia, your CP-SAT model must treat the AMC rules as default constraint templates, but allow administrative users to override specific integer bounds. Specifically, you should parameterize:

1. **`NUM_TERMS_PER_YEAR`**: Cannot be hardcoded to 4 or 5; it must be an input parameter based on the specific hospital/state.
2. **`MAX_SERVICE_TERMS`**: Cannot just be calculated as a 20% fractional limit; it must be capable of being constrained to an integer limit (e.g., `max == 1` for NSW).
3. **`ALLOW_6_MONTH_TERMS`**: Must be a boolean toggle with associated implication logic (specifically for Victoria).