import {
  Box,
  Button,
  HStack,
  Table,
  TableProps,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export const TransactionsTable = ({
  props,
  accessToken,
}: {
  props?: TableProps;
  accessToken: string;
}) => {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (accessToken) load();
  }, [accessToken]);

  const load = async () => {
    const res = await fetch(`http://localhost:3000/transaction`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const transactions = await res.json();
    console.log('transctions', transactions);
    setTransactions(transactions);
  };

  return (
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
        {transactions.map((d: any) => (
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
              <Text color="fg.muted">
                {d.amount}&nbsp;{d.currency}
              </Text>
            </Td>
            <Td>
              <Tag size="sm" colorScheme="green">
                {d.status}
              </Tag>
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
  );
};
