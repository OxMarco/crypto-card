import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
} from '@chakra-ui/react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  text,
}: {
  isOpen: boolean;
  onClose: any;
  text: string;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Proceed?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{text}</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue">Confirm</Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
