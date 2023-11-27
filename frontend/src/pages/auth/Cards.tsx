import { Button, useDisclosure } from "@chakra-ui/react"
import { CardsTable } from "../../components/CardsTable"
import AuthRootPage from "./AuthRoot"
import NewCardModal from "../../modals/NewCard"

const cards = [
  { brand: "Visa", number: "**** **** **** 1234", currency: "USD", status: "active" },
  { brand: "Mastercard", number: "**** **** **** 5678", currency: "USD", status: "suspended" },
  { brand: "Visa", number: "**** **** **** 9012", currency: "USD", status: "blocked" },
]

const CardsPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <AuthRootPage title="Your Cards" button={<Button onClick={onOpen} colorScheme={"blue"}>Add Card</Button>}>
      <NewCardModal onOpen={onOpen} isOpen={isOpen} onClose={onClose} />
      <CardsTable data={cards} />
    </AuthRootPage>
  )
}

export default CardsPage
