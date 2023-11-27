import { Box, VStack, SimpleGrid, Icon, Text, Stack, Heading, Button, Container, useDisclosure, Collapse, useOutsideClick } from '@chakra-ui/react'
import { FiStar, FiSettings, FiMonitor, FiDollarSign, FiUsers, FiLock, FiLink } from 'react-icons/fi'
import Menu from '../components/Menu'
import { useRef, useState } from 'react'

const featureData = [
  {
    icon: FiDollarSign,
    title: 'Cheapest',
    description: 'Best in-class crypto-fiat conversion rates. No bridging, no hidden fees.',
    longDescription: 'As there is no commercial interest, the fees are kept to a minimum. The card is free to use, the main expenses are related to the physical card and infrastructure costs.',
  },
  {
    icon: FiUsers,
    title: 'Community-driven',
    description: 'No VC-funding, no ICO, or token sale. The community owns the project.',
    longDescription: 'A community effort to build the best crypto card. Everyone is welcome to contribute on the GitHub, fees are used to cover the BaaS (Stripe) costs.',
  },
  {
    icon: FiLink,
    title: 'Decentralised',
    description: 'Fully decentralised, self-custodial and open source. Don\'t trust, verify!',
    longDescription: 'No need to top up the card, just hold your crypto and it gets directly converted to USDC.',
  },
]

const AboutPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const collapseRef = useRef(null)
  const [text, setText] = useState<string>('')
  const show = (text: string) => {
    setText(text)
    onOpen()
  }

  useOutsideClick({
    ref: collapseRef,
    handler: () => onClose(),
  })

  return (
    <Box bgColor={'gray.100'}>
      <Menu />
      <Container maxW={'3xl'}>
        <Stack
          direction='column'
          align='center'
          justify='center'
          height='100vh'
          as={Box}
          textAlign={'center'}
          spacing={{ base: '8', md: '10' }}
          >
            <Stack fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}>
              <Text fontWeight={600}>
                About
              </Text>
              <Text fontSize="large">Engineered to be the only crypto card you'll ever need</Text>
            </Stack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} ref={collapseRef}>
              {featureData.map((feature, index) => (
                <VStack key={index} spacing={4} align="center">
                  <Icon as={feature.icon} boxSize={12} color="blue.500" />
                  <Heading fontSize="xl" fontWeight={600}>{feature.title}</Heading>
                  <Text fontSize="md" color={'gray.600'}>{feature.description}</Text>
                  <Button
                    size="sm"
                    fontWeight={400}
                    colorScheme="blue"
                    variant="link"
                    onClick={() => show(feature.longDescription)}
                  >
                    Read more
                  </Button>
                </VStack>
              ))}
            </SimpleGrid>
            <Collapse in={isOpen} animateOpacity>
        <Box
          p='40px'
          color='white'
          mt='4'
          bg='blue.500'
          rounded='md'
          shadow='md'
        >
          <Text>{text}</Text>
        </Box>
      </Collapse>
        </Stack>
      </Container>
    </Box>
  )
}

export default AboutPage
