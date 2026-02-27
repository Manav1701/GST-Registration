// Promoter 2 is identical to Promoter 1 form, just uses "_2" suffix for all field names
import Tab1_Promoter from "./Tab1_Promoter.jsx";

export default function Tab2_Promoter2(props) {
  return <Tab1_Promoter {...props} suffix="_2" />;
}
