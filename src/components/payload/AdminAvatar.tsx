'use client'

import { useAuth } from '@payloadcms/ui'

export default function AdminAvatar() {
  const { user } = useAuth()

  const avatar = user?.avatar

  const avatarUrl = typeof avatar === 'object' && avatar?.url ? avatar.url : null

  const name = typeof user?.name === 'string' ? user.name : user?.email || 'Admin'

  return (
    <div className="custom-admin-avatar" title={name}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="custom-admin-avatar-image" />
      ) : (
        <span className="custom-admin-avatar-initial">{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  )
}
