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
  Tag,
} from '@chakra-ui/react';
import { handleResponse } from '../utils/response-helper';
import api from '../utils/axios.interceptor';

const NewCardModal = ({
  accessToken,
  isOpen,
  onClose,
}: {
  accessToken: string;
  isOpen: boolean;
  onClose: any;
}) => {
  const [cardType, setCardType] = useState('virtual');
  const [currency, setCurrency] = useState('eur');
  const toast = useToast();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await api.post(
      `/card`,
      JSON.stringify({
        type: cardType,
        currency,
      }),
    );

    if (
      await handleResponse(
        res,
        toast,
        'Card successfully created',
        'Failed to created card',
      )
    ) {
      onClose();
      window.location.reload();
    }
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
                  <Radio value="eur">EUR</Radio>
                  <Radio value="usd">USD</Radio>
                </Stack>
              </RadioGroup>

              <Tag>Cost: {cardType === 'virtual' ? '0.10€' : '8.50€'}</Tag>
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
