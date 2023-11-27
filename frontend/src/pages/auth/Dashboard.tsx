import { Grid, GridItem, Heading, SimpleGrid, Stat, StatHelpText, StatLabel, StatNumber, Text, useColorModeValue as mode, useColorModeValue } from "@chakra-ui/react"
import AuthRootPage from "./AuthRoot"
import { UserProfile } from "../../components/UserProfile"

const stats = [
  { title: 'Wallet Balance', value: '$10,000' },
  { title: 'Total Expenses', value: '$1,000' },
]

const DashboardPage = () => {
  return (
    <AuthRootPage title="Dashboard">
      <Grid templateColumns="repeat(2, 1fr)" gap={6} py={6}>
        <GridItem colSpan={1}>
          <UserProfile />
        </GridItem>
        <GridItem colSpan={1}>
          <SimpleGrid columns={1} gap={{ base: '5', md: '6' }}>
              {stats.map((stat) => (
                <Stat
                  p={5}
                  shadow="md"
                  border="1px"
                  borderColor={mode('gray.200', 'gray.700')}
                  borderRadius="md"
                  bg={mode('white', 'gray.700')}
                >
                <StatLabel>{stat.title}</StatLabel>
                <StatNumber>{stat.value}</StatNumber>
              </Stat>
              ))}
            </SimpleGrid>
        </GridItem>
      </Grid>
    </AuthRootPage>
  )
}

export default DashboardPage