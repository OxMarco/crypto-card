import { Box, Button, Container, Heading, Icon, Stack, Text } from '@chakra-ui/react'
import { useRouteError } from 'react-router-dom'
import { FiAlertTriangle, FiArrowLeft } from 'react-icons/fi'

const ErrorPage = () => {
  const error: any = useRouteError()

  return (
    <Box bgColor={'gray.100'}>
      <Container maxW={'3xl'}>
        <Stack
          direction='column'
          align='center'
          justify='center'
          height='100vh'
          as={Box}
          textAlign={'center'}
          spacing={{ base: '2', md: '4' }}
          >
      <Icon as={FiAlertTriangle} boxSize={12} color="red.500" />
      <Heading fontSize="3xl">
        Oops!
      </Heading>
      <Text fontSize="xl">
        Sorry, an unexpected problem has occurred.
      </Text>
      <Text mt={4} color="gray.500" fontStyle="italic">
        Error: {error.statusText || error.message}
      </Text>
      <Button
      variant="outline"
        as="a"
        href="/"
        mt={8}
      >
        <Icon as={FiArrowLeft} />&nbsp;Go Back
      </Button>
    </Stack>
    </Container>
    </Box>
  )
}

export default ErrorPage
