import React, { useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ethers } from "ethers"
import Web3Modal from "web3modal"

import { RootState } from "@/app/store"
import { PropsDefault } from "@/shared/lib/types"
import { CardInfo } from "@/shared/ui/CardInfo"
import { useModal } from "@/shared/ui/BottomSheet"
import { ModalDownload } from "@/entities/download"
import { viewerModel } from "@/entities/viewer/model"
import styles from './WalletCard.module.scss'
import { clsx } from "clsx"

const web3Modal = new Web3Modal({
  cacheProvider: true,
})

export const WalletCard: React.FC<PropsDefault> = ({
  className
}) => {
  const {
    data,
  } = useSelector((state: RootState) => ({
    data: state.viewer.data,
  }))
  const dispatch = useDispatch()
  const { isOpen, open, close } = useModal()

  const connectWallet = useCallback(async () => {
    try {
      const instance = await web3Modal.connect()
      const provider = new ethers.BrowserProvider(instance)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      // Ask user to sign a message for authentication
      const message = `Sign in to DataHub at ${new Date().toISOString()}`
      const signature = await signer.signMessage(message)
      // Send to backend for verification and JWT
      // Replace with your actual API call
      const response = await fetch('/api/accounts/auth/web3/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: address, signature, message })
      })
      if (response.ok) {
        // Optionally store JWT, update Redux, etc.
        dispatch(viewerModel.thunks.fetch() as any)
      } else {
        alert('Authentication failed')
      }
    } catch (err) {
      alert('Wallet connection failed')
    }
  }, [dispatch])

  if (data.isWalletConnect) {
    return null
  }

  return (
    <>
      <CardInfo
        className={clsx(className, styles.root)}
        title={'Link OORT Wallet'}
        description={'Connect OORT Wallet to withdraw points and earn even more'}
        icon={'link-outline'}
        onClick={connectWallet}
      />
      <ModalDownload
        isOpen={isOpen}
        setIsOpen={close}
      />
    </>
  )
}