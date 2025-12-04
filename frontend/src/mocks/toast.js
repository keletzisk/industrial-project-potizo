const mockUseToast = jest.fn();

jest.mock("@chakra-ui/toast", () => {
  return {
    useToast: () => mockUseToast,
  };
});

function toastJSON(title, status = "success") {
  return {
    title: title,
    status: status,
    isClosable: true,
  };
}

export function expectMockToastMessage(message, status = "success") {
  expect(mockUseToast.mock.calls).toHaveLength(1);
  expect(mockUseToast.mock.calls[0][0]).toMatchObject(
    toastJSON(message, status)
  );
}
