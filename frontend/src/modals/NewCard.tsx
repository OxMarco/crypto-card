import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
  useToast,
  Tag
} from '@chakra-ui/react';

const NewCardModal = ({ isOpen, onOpen, onClose }: { isOpen: boolean, onOpen: any, onClose: any }) => {
  const [cardType, setCardType] = useState('virtual');
  const [currency, setCurrency] = useState('EUR');
  const toast = useToast();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    toast({
      title: 'Card created.',
      description: `A new ${cardType} card with currency ${currency} has been created.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    onClose();
  };

  return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Payment Card</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl as={Stack} spacing={4}>
                <RadioGroup onChange={(e) => setCardType(e)} value={cardType}>
                  <FormLabel>Card Type</FormLabel>
                  <Stack direction="row">
                    <Radio value="virtual">Virtual</Radio>
                    <Radio value="physical">Physical</Radio>
                  </Stack>
                </RadioGroup>

                <RadioGroup onChange={(e) => setCurrency(e)} value={currency}>
                  <FormLabel>Currency</FormLabel>
                  <Stack direction="row">
                    <Radio value="EUR">EUR</Radio>
                    <Radio value="USD">USD</Radio>
                  </Stack>
                </RadioGroup>

                <Tag>
                  Cost: {cardType === 'virtual' ? '0.10€' : '8.50€'}
                </Tag>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                Create Card
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
  );
};

export default NewCardModal;
