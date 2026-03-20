import { FormInput, FormSelect, FormToggle, FormRadioGroup, SectionCard, InfoAlert, Grid2, Grid3, DynamicList } from "../../../components/ui/index.jsx";
import { FileInput } from "../../../components/ui/index.jsx";
import { CONSTITUTION_TYPES, REGISTRATION_REASONS, REG_TYPES, PROOF_OF_CONSTITUTION, POSSESSION_TYPES, ELECTRICITY_BOARDS, getStatesForCountry, getCitiesForState } from "../../../constants/dropdowns.js";

// Compact field widths for known-length fields
const w = (ch) => ({ style: { maxWidth: `${ch}ch` } });

export default function Tab1_BusinessAndGoods({ data, update, errors, touched, touch }) {
  const f = (name) => ({ value: data[name], error: touched[name] ? errors[name] : null, onChange: (e) => update(name, e.target.value), onBlur: () => touch(name) });
  const sel = (name) => ({ value: data[name], error: touched[name] ? errors[name] : null, onChange: (e) => update(name, e.target.value), onBlur: () => touch(name) });

  const stateItems = getStatesForCountry('IN');
  const districtItems = data.state ? getCitiesForState('IN', data.state) : [];

  return (
    <>
      {/* ── SECTION A: Business Identity ── */}
      <SectionCard title="Business Identity" icon="🏢">
        <Grid3>
          <FormInput label="Legal Name of the Business" required {...f("legal_name")} placeholder="As per PAN records" />
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: "0 0 14ch" }}>
              <FormInput label="PAN" required {...f("pan")} placeholder="ABCDE1234F" hint="10 chars" />
            </div>
            <div style={{ flex: 1 }}>
              <FormInput label="PAN Creation Date" required type="date" {...f("pan_date")} />
            </div>
          </div>
          <FormInput label="Trade Name" required {...f("trade_name")} placeholder="Trade name (if different)" />
        </Grid3>
        <Grid3>
          <FormSelect label="Constitution of Business" required {...sel("Constitution of Business")} items={CONSTITUTION_TYPES} />
          <FormSelect label="Name of the State" required {...sel("state")} items={stateItems}
            onChange={(e) => { update("state", e.target.value); update("District", ""); }} />
          <FormSelect label="District" required {...sel("District")} items={districtItems} disabled={!data.state} />
        </Grid3>
      </SectionCard>

      {/* ── SECTION B: Registration Options ── */}
      <SectionCard title="Registration Options" icon="⚙️">
        <Grid2>
          <div>
            <FormToggle label="Applying as casual taxable person?" value={data.toggle} onChange={(v) => update("toggle", v)} />
            <FormToggle label="Option For Composition?" value={data.toggle_1} onChange={(v) => update("toggle_1", v)} />
            <FormRadioGroup label="Option for registration under Rule 14A" value={data.radioBlocks} onChange={(v) => update("radioBlocks", v)}
              items={[{ value: 0, label: "Yes" }, { value: 1, label: "No" }]} />
            <InfoAlert>Rule 14A: ITC to pass ≤ ₹2.5L/month. Aadhaar Auth mandatory.</InfoAlert>
          </div>
          <div>
            <FormSelect label="Reason to obtain registration" required {...sel("reason")} items={REGISTRATION_REASONS} />
            <Grid2>
              <FormInput label="Commencement Date" required type="date" {...f("commencement_date")} />
              <FormInput label="Liability to register date" required type="date" {...f("commencement_date_1")} />
            </Grid2>
          </div>
        </Grid2>
      </SectionCard>

      {/* ── SECTION C: Existing Registrations ── */}
      <SectionCard title="Existing Registrations" icon="🗂️">
        <DynamicList value={data.existing_registrations_list} onChange={(v) => update("existing_registrations_list", v)}
          emptyItem={{ type: "", reg_no: "", date: "" }} addLabel="Add Existing Registration"
          renderItem={(item, _i, updateItem) => (
            <Grid3>
              <FormSelect label="Type of Registration" value={item.type} onChange={(e) => updateItem({ type: e.target.value })} items={REG_TYPES} />
              <FormInput label="Registration No." value={item.reg_no} onChange={(e) => updateItem({ reg_no: e.target.value })} placeholder="Registration number" />
              <FormInput label="Date of Registration" value={item.date} onChange={(e) => updateItem({ date: e.target.value })} type="date" />
            </Grid3>
          )}
        />
      </SectionCard>

      {/* ── SECTION D: Proof of Constitution ── */}
      <SectionCard title="Proof of Constitution" icon="📄">
        <Grid2>
          <FormSelect label="Proof of Constitution of Business" value={data.proof_of_constitution} onChange={(e) => update("proof_of_constitution", e.target.value)} items={PROOF_OF_CONSTITUTION} />
          <div />
        </Grid2>
        <Grid2>
          <FileInput label="Upload Constitution Document" value={data.constitution_document} onChange={(v) => update("constitution_document", v)} maxKb={1024} />
          <FileInput label="Document Upload" value={data.file} onChange={(v) => update("file", v)} maxKb={1024} />
        </Grid2>
      </SectionCard>

      {/* ── SECTION E: Goods (HSN) & Services (SAC) ── */}
      <SectionCard title="Goods / Commodities (HSN)" icon="📦">
        <FormInput label="Search HSN Chapter by Name or Code" value={data.hsn_search} onChange={(e) => update("hsn_search", e.target.value)} placeholder="Type to search HSN code or commodity name..." />
        <DynamicList value={data.commodities_list} onChange={(v) => update("commodities_list", v)}
          emptyItem={{ hsn_code: null, description: null }} addLabel="Add Commodity"
          renderItem={(item, _i, updateItem) => (
            <Grid2>
              <FormInput label="HSN Chapter Code" value={item.hsn_code ?? ""} onChange={(e) => updateItem({ hsn_code: e.target.value || null })} placeholder="HSN Code" />
              <FormInput label="Description of Goods" value={item.description ?? ""} onChange={(e) => updateItem({ description: e.target.value || null })} placeholder="Description" />
            </Grid2>
          )}
        />
      </SectionCard>

      <SectionCard title="Services (SAC)" icon="🛠️">
        <FormInput label="Search by Name or SAC Code" value={data.sac_search} onChange={(e) => update("sac_search", e.target.value)} placeholder="Type to search SAC code or service name..." />
        <DynamicList value={data.services_list} onChange={(v) => update("services_list", v)}
          emptyItem={{ sac_code: null, description: null }} addLabel="Add Service"
          renderItem={(item, _i, updateItem) => (
            <Grid2>
              <FormInput label="Service Code (SAC)" value={item.sac_code ?? ""} onChange={(e) => updateItem({ sac_code: e.target.value || null })} placeholder="SAC Code" />
              <FormInput label="Description of Service" value={item.description ?? ""} onChange={(e) => updateItem({ description: e.target.value || null })} placeholder="Description" />
            </Grid2>
          )}
        />
      </SectionCard>

      {/* ── SECTION F: State Specific (Gujarat) ── */}
      <SectionCard title="State Specific Information (Gujarat)" icon="🏛️">
        <Grid3>
          <FormSelect label="Nature of possession — PPB" required {...sel("nature_of_possession_ppb")} items={POSSESSION_TYPES} />
          <FormSelect label="Electricity Board / Unit" required {...sel("electricity_board")} items={ELECTRICITY_BOARDS} />
          <FormInput label="CA / Consumer Number" required {...f("consumer_number")} placeholder="Consumer number" />
        </Grid3>
        <Grid3>
          <FormInput label="Prof. Tax EC No." {...f("prof_tax_ec")} placeholder="EC No." />
          <FormInput label="Prof. Tax RC No." {...f("prof_tax_rc")} placeholder="RC No." />
          <FormInput label="State Excise Licence No." {...f("state_excise_lic")} placeholder="Licence number" />
        </Grid3>
        <Grid2>
          <FormInput label="Name of person holding Excise Licence" {...f("excise_person_name")} placeholder="Full name" />
          <div />
        </Grid2>
      </SectionCard>
    </>
  );
}
