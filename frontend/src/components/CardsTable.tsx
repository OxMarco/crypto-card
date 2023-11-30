import { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Table,
  TableProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { FiPause, FiPlay, FiSlash } from 'react-icons/fi';

export const CardsTable = ({
  props,
  accessToken,
}: {
  props?: TableProps;
  accessToken: string;
}) => {
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    if (accessToken) load();
  }, [accessToken]);

  const load = async () => {
    const res = await fetch(`http://localhost:3000/card`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const cards = await res.json();
    setCards(cards);
  };

  const pauseCard = async (cardId: string) => {
    const res = await fetch(`http://localhost:3000/card`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ cardId, status: 'inactive' }),
    });
    const response = await res.json();
    console.log('response', response);
    await load();
  };

  const unpauseCard = async (cardId: string) => {
    const res = await fetch(`http://localhost:3000/card`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ cardId, status: 'active' }),
    });
    const response = await res.json();
    console.log('response', response);
    await load();
  };

  const blockCard = async (cardId: string) => {
    const res = await fetch(`http://localhost:3000/card`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ cardId, status: 'canceled' }),
    });
    const response = await res.json();
    console.log('response', response);
    await load();
  };

  return (
    <Table {...props}>
      <Thead>
        <Tr>
          <Th></Th>
          <Th>Type</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {cards
          .sort(
            (a: any, b: any) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )
          .map((d: any, index: number) => (
            <Tr key={index}>
              <Td>
                <HStack spacing="3">
                  <Box>
                    <Text fontWeight="medium">{d.brand}</Text>
                    <Text color="fg.muted">{d.last4}</Text>
                  </Box>
                </HStack>
              </Td>
              <Td>
                <HStack spacing="3">
                  <Box>
                    <Text fontWeight="medium" fontStyle="italic">
                      {d.type}
                    </Text>
                    <Text fontWeight="light" color="fg.muted">
                      {d.currency}
                    </Text>
                  </Box>
                </HStack>
              </Td>
              <Td>
                {d.status === 'active' && (
                  <Badge size="sm" colorScheme={'green'}>
                    Active
                  </Badge>
                )}
                {d.status === 'inactive' && (
                  <Badge size="sm" colorScheme={'yellow'}>
                    Suspended
                  </Badge>
                )}
                {d.status === 'canceled' && (
                  <Badge size="sm" colorScheme={'red'}>
                    Blocked
                  </Badge>
                )}
              </Td>
              <Td>
                {d.status !== 'canceled' && (
                  <HStack spacing="1">
                    {d.status === 'inactive' ? (
                      <IconButton
                        icon={<FiPlay />}
                        variant="tertiary"
                        aria-label="Pause card"
                        onClick={() => unpauseCard(d.cardId)}
                      />
                    ) : (
                      <IconButton
                        icon={<FiPause />}
                        variant="tertiary"
                        aria-label="Unause card"
                        onClick={() => pauseCard(d.cardId)}
                      />
                    )}
                    <IconButton
                      icon={<FiSlash />}
                      variant="tertiary"
                      aria-label="Block card"
                      onClick={() => blockCard(d.cardId)}
                    />
                  </HStack>
                )}
              </Td>
              <Td>
                <Button as="a" href="/cards/detail" variant="outline">
                  View
                </Button>
              </Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
};
