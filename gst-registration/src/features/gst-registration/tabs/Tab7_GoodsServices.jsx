import { FormInput, SectionCard, Grid2, DynamicList } from "../../../components/ui/index.jsx";

export default function Tab7_GoodsServices({ data, update }) {
  return (
    <>
      <SectionCard title="Goods / Commodities (HSN)" icon="📦">
        <FormInput label="Search HSN Chapter by Name or Code" value={data.hsn_search} onChange={(e)=>update("hsn_search",e.target.value)} placeholder="Type to search HSN code or commodity name..."/>
        <DynamicList value={data.commodities_list} onChange={(v)=>update("commodities_list",v)}
          emptyItem={{hsn_code:null,description:null}} addLabel="Add Commodity"
          renderItem={(item,_i,updateItem)=>(
            <Grid2>
              <FormInput label="HSN Chapter Code" value={item.hsn_code??""} onChange={(e)=>updateItem({hsn_code:e.target.value||null})} placeholder="HSN Code"/>
              <FormInput label="Description of Goods" value={item.description??""} onChange={(e)=>updateItem({description:e.target.value||null})} placeholder="Description"/>
            </Grid2>
          )}
        />
      </SectionCard>

      <SectionCard title="Services (SAC)" icon="🛠️">
        <FormInput label="Search by Name or SAC Code" value={data.sac_search} onChange={(e)=>update("sac_search",e.target.value)} placeholder="Type to search SAC code or service name..."/>
        <DynamicList value={data.services_list} onChange={(v)=>update("services_list",v)}
          emptyItem={{sac_code:null,description:null}} addLabel="Add Service"
          renderItem={(item,_i,updateItem)=>(
            <Grid2>
              <FormInput label="Service Code (SAC)" value={item.sac_code??""} onChange={(e)=>updateItem({sac_code:e.target.value||null})} placeholder="SAC Code"/>
              <FormInput label="Description of Service" value={item.description??""} onChange={(e)=>updateItem({description:e.target.value||null})} placeholder="Description"/>
            </Grid2>
          )}
        />
      </SectionCard>
    </>
  );
}
