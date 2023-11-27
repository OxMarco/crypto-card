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
} from '@chakra-ui/react'
import { FiPause, FiPlay, FiSlash } from 'react-icons/fi'

export const CardsTable = ({ props, data } : { props?: TableProps, data: any }) => (
  <Table {...props}>
    <Thead>
      <Tr>
        <Th></Th>
        <Th>Currency</Th>
        <Th>Status</Th>
        <Th>Actions</Th>
        <Th></Th>
      </Tr>
    </Thead>
    <Tbody>
      {data.map((d: any) => (
        <Tr key={d.id}>
          <Td>
            <HStack spacing="3">
              <Box>
                <Text fontWeight="medium">{d.brand}</Text>
                <Text color="fg.muted">{d.number}</Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text color="fg.muted">{d.currency}</Text>
          </Td>
          <Td>
          {d.status === 'active' && (
            <Badge size="sm" colorScheme={'green'}>Active</Badge>
          )}
          {d.status === 'suspended' && (
            <Badge size="sm" colorScheme={'yellow'}>Suspended</Badge>
          )}
          {d.status === 'blocked' && (
            <Badge size="sm" colorScheme={'red'}>Blocked</Badge>
          )}
          </Td>
          <Td>
          {d.status !== 'blocked' && (
            <HStack spacing="1">
            {d.status !== 'suspended' ? (
              <IconButton icon={<FiPause />} variant="tertiary" aria-label="Pause card" />
            ) : (
              <IconButton icon={<FiPlay />} variant="tertiary" aria-label="Unause card" />
            )}
              <IconButton icon={<FiSlash />} variant="tertiary" aria-label="Block member" />
            </HStack>
          )}
          </Td>
          <Td>
          <Button as="a" href="/cards/detail" variant="outline">View</Button>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
)
