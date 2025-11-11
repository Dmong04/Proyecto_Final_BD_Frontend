
interface Supplier {
  id: number
  name: string
  email: string
  address: string
  phones?: SupplierPhone[]
}

interface SupplierPhone {
  id: number
  phone: string
  supplier_id: number
}

interface ProviderData {
  name: string
  email: string
  address: string
}
