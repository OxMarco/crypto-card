export const handleResponse = async (
  res: any,
  toast: any,
  successMsg: string = '',
  failureMsg: string = '',
): Promise<boolean> => {
  if (res.status !== 200 && res.status !== 201) {
    const response = await res.json();

    if (failureMsg.length > 0)
      toast({
        title: failureMsg,
        description: response?.message || response?.error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

    return false;
  } else {
    if (successMsg.length > 0)
      toast({
        title: successMsg,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

    return true;
  }
};
