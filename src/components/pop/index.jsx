/* eslint-disable taro/function-naming */
import Taro, { Component } from '@tarojs/taro'

import { View, Image} from '@tarojs/components'

import PropTypes from 'prop-types'
import classNames from 'classnames'
import _isFunction from 'lodash/isFunction'
import './index.styl'
import {iconClose} from '../../imgs/index'
import AtComponent from '../common/component'

export default class HgdPop extends AtComponent {
  constructor (props) {
    super(...arguments)

    const { isOpened } = props
    this.state = {
      _isOpened: isOpened
    }
  }
  componentWillMount() {

  }
  componentWillReceiveProps (nextProps) {
    const { isOpened } = nextProps
    if (isOpened !== this.state._isOpened) {
      this.setState({
        _isOpened: isOpened
      })
      !isOpened && this.handleClose()
    }
  }

  handleClose = () => {
    if (_isFunction(this.props.onClose)) {
      this.props.onClose()
    }
  }

  close = () => {
    this.setState(
      {
        _isOpened: false
      },
      this.handleClose
    )
  }

  handleTouchMove = e => {
    e.stopPropagation()
  }

  render () {
    const { _isOpened } = this.state

    const rootClass = classNames(
      'at-float-layout',
      {
        'at-float-layout--active': _isOpened
      },
      this.props.className
    )

    return (
      <View className={rootClass} onTouchMove={this.handleTouchMove}>
        <View onClick={this.close} className='at-float-layout__overlay' />
        <View className='at-float-layout__container layout'>
          <View className='icon-close'>
            <Image src={iconClose} className='icon-close-img' onClick={this.close} />
          </View>
          <View className='layout-body'>
            {this.props.children}
          </View>
        </View>
      </View>
    )
  }
}

HgdPop.defaultProps = {
  isOpened: false
}

HgdPop.propTypes = {
  onClose: PropTypes.func,
  title: PropTypes.string,
  isOpened: PropTypes.bool
}
