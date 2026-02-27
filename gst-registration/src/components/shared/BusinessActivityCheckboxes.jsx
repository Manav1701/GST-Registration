import { FormCheckbox, FormInput } from "../ui/index.jsx";

const ACTIVITIES = [
  { key:"bonded_warehouse", label:"Bonded Warehouse" },
  { key:"eou", label:"EOU / STP / EHTP" },
  { key:"export", label:"Export" },
  { key:"factory", label:"Factory / Manufacturing" },
  { key:"import", label:"Import" },
  { key:"services", label:"Supplier of Services" },
  { key:"leasing", label:"Leasing Business" },
  { key:"office", label:"Office / Sale Office" },
  { key:"recipient", label:"Recipient of Goods or Services" },
  { key:"retail", label:"Retail Business" },
  { key:"warehouse", label:"Warehouse / Depot" },
  { key:"wholesale", label:"Wholesale Business" },
  { key:"works_contract", label:"Works Contract" },
];

export default function BusinessActivityCheckboxes({ data, update, prefix="ba_" }) {
  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"0 18px" }}>
        {ACTIVITIES.map((a) => (
          <FormCheckbox key={a.key} label={a.label}
            value={!!data[`${prefix}${a.key}`]}
            onChange={(v) => update(`${prefix}${a.key}`, v)}
          />
        ))}
        <FormCheckbox label="Others (Please Specify)"
          value={!!data[`${prefix}others`]}
          onChange={(v) => update(`${prefix}others`, v)}
        />
      </div>
      {data[`${prefix}others`] && (
        <FormInput label="Specify Other Activity"
          value={data[`${prefix}others_specify`]??""}
          onChange={(e) => update(`${prefix}others_specify`, e.target.value||null)}
          placeholder="Describe the other activity"
        />
      )}
    </>
  );
}
