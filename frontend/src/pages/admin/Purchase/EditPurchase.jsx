import { useParams } from "react-router-dom";
import PurchaseForm from "./PurchaseForm";

export default function EditPurchase() {
  const { id } = useParams();
  return <PurchaseForm mode="edit" purchaseId={id} />;
}
