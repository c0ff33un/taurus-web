import React from 'react'
import {
  Button,
  Dialog as MaterialDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'

type ComponentProps = {
  title: string
  text: string
  open: boolean
  setOpen: (val: boolean) => void
  agreeText?: string
  cancelText?: string
  handleAgree: () => void
  handleCancel?: () => void
}

export default function Dialog({
  title,
  text,
  open,
  setOpen,
  agreeText: agreeTextProp,
  cancelText: cancelTextProp,
  handleAgree: handleAgreeProp,
  handleCancel: handleCancelProp,
}: ComponentProps) {

  const handleAgree = () => {
    handleAgreeProp()
    setOpen(false)
  }

  const handleCancel = () => {
    if (handleCancelProp) {
      handleCancelProp()
    }
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const agreeText = agreeTextProp ? agreeTextProp : 'Yes'
  const cancelText = cancelTextProp ? cancelTextProp : 'Cancel'

  return (
    <MaterialDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          {cancelText}
        </Button>
        <Button onClick={handleAgree} color="primary" autoFocus>
          {agreeText}
        </Button>
      </DialogActions>
    </MaterialDialog>
  )
}
