import { Button } from "@chakra-ui/react"
import AuthRootPage from "./AuthRoot"
import { TransactionsTable } from "../../components/TransactionsTable"

const transactions = [
  { id: 1, merchant: { name: 'Amazon', country: 'US' }, amount: 100, currency: 'USD', status: 'active', createdAt: 170000 },
  { id: 2, merchant: { name: 'Amazon', country: 'US' }, amount: 100, currency: 'USD', status: 'active', createdAt: 170000 },
  { id: 3, merchant: { name: 'Amazon', country: 'US' }, amount: 100, currency: 'USD', status: 'active', createdAt: 170000 },
  { id: 4, merchant: { name: 'Amazon', country: 'US' }, amount: 100, currency: 'USD', status: 'active', createdAt: 170000 },
]

const CardDetailPage = () => {
  return (
    <AuthRootPage title="Card and Transactions Details" back={true} button={<Button as="a" href="/cards/settings" colorScheme={"blue"}>Edit Card</Button>}>
      <TransactionsTable data={transactions} />
    </AuthRootPage>
  )
}

export default CardDetailPage
