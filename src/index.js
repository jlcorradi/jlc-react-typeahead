import React, { useState, useRef, useEffect } from 'react'
import styles from './styles.module.css'

const ARROW_UP_KEY = 38
const ARROW_DOWN_KEY = 40
const ENTER_KEY = 13
const ESCAPE_KEY = 27
const TAB_KEY = 9

const MIN_TEXT_LENGHT = 3

const Typeahead = ({
  placeholder,
  onSearch,
  itemProp,
  labelProp,
  onItemSelected,
  selectedItem,
  onAbort,
  children,
  ...rest
}) => {
  const [optionsVisible, setOptionsVisible] = useState(false)
  const [currentOptionIndex, setCurrentOptionIndex] = useState(-1)
  const [internalSelected, setInternalSelected] = useState(selectedItem)
  const inputRef = useRef()

  useEffect(() => {
    if (selectedItem) {
      inputRef.current.value = selectedItem[labelProp]
    }
  }, [selectedItem])

  function selectItem(index) {
    let item = children[index].props[itemProp]
    setInternalSelected(item)
    setOptionsVisible(false)
    if (item[labelProp]) {
      inputRef.current.value = item[labelProp]
    }
    if (onItemSelected) {
      onItemSelected(item)
    }
  }

  function reset() {
    if (internalSelected[labelProp]) {
      inputRef.current.value = internalSelected[labelProp]
    }
  }

  function handleKeyDown(e) {
    switch (e.keyCode) {
      case ARROW_DOWN_KEY:
        if (currentOptionIndex < children.length - 1) {
          setCurrentOptionIndex(currentOptionIndex + 1)
        }
        break
      case ARROW_UP_KEY:
        if (currentOptionIndex > 0) {
          setCurrentOptionIndex(currentOptionIndex - 1)
        }
        break
      case ENTER_KEY:
        if (children.length && currentOptionIndex > -1) {
          selectItem(currentOptionIndex)
        }
        break
      case ESCAPE_KEY:
        abort()
        break
      case TAB_KEY:
        reset()
        break
      default:
        break
    }
  }

  function abort() {
    reset()
    setOptionsVisible(false)
    setCurrentOptionIndex(-1)
    if (onAbort) {
      onAbort()
    }
  }

  function handleOnChange(e) {
    if (e.target.value.length < MIN_TEXT_LENGHT) {
      setOptionsVisible(false)
      setCurrentOptionIndex(-1)
      return
    }
    if (onSearch) {
      onSearch(e.target.value)
    }
    setOptionsVisible(true)
  }

  return (
    <div className={styles.typeaheadContainer}>
      <input
        type='text'
        ref={inputRef}
        className='form-control'
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        onChange={handleOnChange}
        {...rest}
      />
      {optionsVisible && (
        <div className={styles.typeaheadBody} onKeyDown={handleKeyDown}>
          {children.map((child, index) => (
            <div
              key={index}
              className={index == currentOptionIndex ? styles.active : null}
              onClick={() => {
                setCurrentOptionIndex(index)
                selectItem(index)
              }}
            >
              {child}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Typeahead
