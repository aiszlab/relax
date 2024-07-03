/**
 * @jest-environment jsdom
 */

import { fireEvent, render } from '@testing-library/react'
import { useFocus } from '../../src'
import { type FC, createElement } from 'react'

enum FocusedToken {
  Focused = 'focused',
  Blurred = 'blurred'
}

type Props = Parameters<typeof useFocus>[0]

const Focus: FC<Exclude<Props, undefined>> = ({ onBlur, onFocus, onFocusChange }) => {
  const [isFocused, focusProps] = useFocus({ onBlur, onFocus, onFocusChange })
  return createElement(
    'div',
    {
      ...focusProps,
      'data-testid': 'focusable'
    },
    isFocused ? FocusedToken.Focused : FocusedToken.Blurred
  )
}

describe('useFocus', () => {
  it('focus', async () => {
    const blur = jest.fn()
    const focus = jest.fn()
    const focusChange = jest.fn()

    const { getByTestId, queryByText } = render(
      createElement(Focus, { onBlur: blur, onFocus: focus, onFocusChange: focusChange })
    )
    const trigger = getByTestId('focusable')

    // first render, not focused
    expect(queryByText(FocusedToken.Focused)).toBeNull()
    expect(queryByText(FocusedToken.Blurred)).not.toBeNull()
    expect(focus).toHaveBeenCalledTimes(0)
    expect(blur).toHaveBeenCalledTimes(0)
    expect(focusChange).toHaveBeenCalledTimes(0)

    // test focus
    fireEvent.focus(trigger)
    expect(queryByText(FocusedToken.Focused)).not.toBeNull()
    expect(queryByText(FocusedToken.Blurred)).toBeNull()
    expect(focus).toHaveBeenCalledTimes(1)
    expect(blur).toHaveBeenCalledTimes(0)
    expect(focusChange).toHaveBeenCalledTimes(1)

    // test blur
    fireEvent.blur(trigger)
    expect(queryByText(FocusedToken.Focused)).toBeNull()
    expect(queryByText(FocusedToken.Blurred)).not.toBeNull()
    expect(focus).toHaveBeenCalledTimes(1)
    expect(blur).toHaveBeenCalledTimes(1)
    expect(focusChange).toHaveBeenCalledTimes(2)
  })
})
