import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { mapToCssModules } from './Shared/helper.js'
import CFade from './CFade'

//component - CoreUI / CAlert
const CAlert = props => {
  let {
    children,
    className,
    cssModule,
    //
    onShowUpdate,
    closeButton,
    transition,
    color,
    fade,
    show,
    ...attributes
  } = props

  //render
  const classes = mapToCssModules(classNames(
    className,
    'alert',
    {
      [`alert-${color}`]: color,
      'alert-dismissible': closeButton
    }
  ), cssModule)
  
  const alertTransition = {
    ...CFade.defaultProps,
    ...transition,
    baseClass: fade ? transition.baseClass : '',
    timeout: fade ? transition.timeout : 0
  }
  const [isOpen, setIsOpen] = useState(show)
  
  useEffect(() => {
    setIsOpen(show)
  }, [show])

  let timeout = useRef(null)

  useEffect(() => {
    if (onShowUpdate) {
      onShowUpdate(isOpen)
    }
    clearTimeout(timeout.current)
    if (typeof isOpen === 'number' && isOpen > 0) {
      timeout.current = setTimeout(() => {
        setIsOpen(isOpen - 1)
      }, 1000)
    }
    return () => clearTimeout(timeout)
  }, [isOpen])

  return (
    <CFade 
      {...alertTransition} 
      tag="div"
      className={classes} 
      in={Boolean(isOpen)} 
      role="alert"
      {...attributes} 
    >
      {children}
      {
        closeButton ?
          <button 
            type="button" 
            className="close"
            aria-label="Close"
            onClick={() => setIsOpen(false)} 
          >
            <span aria-hidden="true">&times;</span>
          </button>
          : null
      }
    </CFade>
  )
}
CAlert.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  //
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
  onShowUpdate: PropTypes.func,
  closeButton: PropTypes.bool,
  color: PropTypes.string,
  fade: PropTypes.bool,
  show: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  transition: PropTypes.shape(CFade.propTypes),
}
CAlert.defaultProps = {
  tag: 'div',
  //
  show: true,
  fade: true,
  transition: {
    ...CFade.defaultProps,
    unmountOnExit: true,
  }
}
//export
export default CAlert