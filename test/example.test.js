import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';
import ExampleNode from '../src/example/ExampleNode';

// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

describe('Image viewer', () => {
  test('show/hide image viewer', () => {
    const { getByTestId } = render(
      <ExampleNode />,
    )
    fireEvent.click(getByTestId('btnShowImage'))
    fireEvent.click(getByTestId('btnHideImage'))
  })
  test('show/hide image viewer with doms', () => {
    const { getByTestId } = render(
      <ExampleNode />,
    )
    fireEvent.click(getByTestId('btnShowImageWithDoms'))
    fireEvent.click(getByTestId('btnHideImage'))
  })
})

describe('Image list viewer', () => {
  test('show/hide image list viewer', () => {
    const { getByTestId } = render(
      <ExampleNode />,
    )
    fireEvent.click(getByTestId('btnShowImageList'))
    fireEvent.click(getByTestId('btnHideImageList'))
  })
  test('show/hide image list viewer with doms', () => {
    const { getByTestId } = render(
      <ExampleNode />,
    )
    fireEvent.click(getByTestId('btnShowImageListWithDoms'))
    fireEvent.click(getByTestId('btnHideImageList'))
  })
  test('show/hide image list viewer with a great number of images', () => {
    const { getByTestId } = render(
      <ExampleNode />,
    )
    fireEvent.click(getByTestId('btnShowImageListWithBig'))
    fireEvent.click(getByTestId('btnHideImageList'))
  })
})

