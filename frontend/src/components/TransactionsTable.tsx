import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Table,
  TableProps,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'

export const TransactionsTable = ({ props, data } : { props?: TableProps, data: any }) => (
  <Table {...props}>
    <Thead>
      <Tr>
        <Th>Merchant</Th>
        <Th>Amount</Th>
        <Th>Status</Th>
        <Th>Time</Th>
        <Th></Th>
      </Tr>
    </Thead>
    <Tbody>
      {data.map((d: any) => (
        <Tr key={d.id}>
          <Td>
            <HStack spacing="3">
              <Box>
                <Text fontWeight="medium">{d.merchant.name}</Text>
                <Text color="fg.muted">{d.merchant.country}</Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text color="fg.muted">{d.amount}&nbsp;{d.currency}</Text>
          </Td>
          <Td>
            <Tag size="sm" colorScheme="green">{d.status}</Tag>
          </Td>
          <Td>
            <Text color="fg.muted">{d.createdAt}</Text>
          </Td>
          <Td>
          <Button variant="outline">Dispute</Button>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
)
