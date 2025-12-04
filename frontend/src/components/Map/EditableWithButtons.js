import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Input,
  useEditableControls,
} from "@chakra-ui/react";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";

const MAX_NICKNAME_LEN = 15;

export function EditableWithButtons({
  defaultValue,
  onSubmit,
  editText,
  textFontSize = "md",
  textFontWeight = "bold",
}) {
  const [inputText, setInputText] = useState("");

  function handleInputChange(event) {
    setInputText(event.target.value);
  }

  function EditableControls() {
    const {
      isEditing,
      isDisabled,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup alignItems="center" justifyContent="center" size="sm">
        <IconButton
          icon={<FaCheck />}
          {...getSubmitButtonProps()}
          isDisabled={isDisabled || !inputText}
        />
        <IconButton icon={<FaTimes />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center" alignItems="center">
        {editText ? (
          <Button leftIcon={<FaEdit />} {...getEditButtonProps()}>
            {editText}
          </Button>
        ) : (
          <IconButton size="sm" icon={<FaEdit />} {...getEditButtonProps()} />
        )}
      </Flex>
    );
  }

  return (
    <Editable
      textAlign="center"
      defaultValue={defaultValue}
      fontWeight={textFontWeight}
      fontSize={textFontSize}
      isPreviewFocusable={false}
      submitOnBlur={false}
      onSubmit={onSubmit}
    >
      <Flex>
        <EditablePreview display="flex" alignItems="center" mr={3} />
        <Input
          maxLength={MAX_NICKNAME_LEN}
          as={EditableInput}
          mr={3}
          value={inputText}
          onChange={handleInputChange}
        />
        <EditableControls />
      </Flex>
    </Editable>
  );
}
